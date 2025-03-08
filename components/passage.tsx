"use client";
import { type PropsWithChildren, useRef, useState } from "react";
import { Diff } from "diff-match-patch-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDiff } from "@/lib/utils";
import { Version } from "@prisma/client";
import { DiffWord, Title } from "@/components/typography";
import { DialogueWithVersion } from "@/lib/db/types";
import { saveSelfEdit } from "@/actions/version";
import { changeTitle } from "@/actions/dialogue";
import { toast } from "sonner";
import { ClipboardCopy, PenLine } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PassageAction, { RevertDialog } from "@/components/passage-action";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";

type PassageProps = {
  passage: DialogueWithVersion;
};

type PassageTitleProps = {
  passage: DialogueWithVersion;
};

type PassageBodyProps = {
  original: Version;
  edit: Version;
};

type PassageCardProps = {
  version: Version;
  isEdit?: boolean;
};

type PassageContentProps = {
  content: Diff[][];
};

const PassageTitle = ({ passage }: PassageTitleProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const saveTitle = async () => {
    if (!ref.current) return;
    const title = ref.current.innerText.trim();
    if (title === "") ref.current.innerText = "Untitled document";

    if (title === passage?.title) return;
    const response = await changeTitle(passage.id, title);
    if (response) {
      toast.error("An error occurred.", {
        description: response.message,
      });
    }
  };

  return (
    <Title className="dark:text-gray-100">
      <span
        ref={ref}
        className="rounded-xl"
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape" || e.key === "Tab") {
            e.preventDefault();
            ref.current?.blur();
          }
        }}
        onBlur={() => saveTitle()}
      >
        {!!passage?.title ? passage.title : "Untitled document"}
      </span>
    </Title>
  );
};

const Copy = ({ text }: { text: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger aria-label="Copy to clipboard">
          <ClipboardCopy
            className="cursor-pointer translate-y-[-1px] h-5 w-5"
            onClick={() => {
              navigator.clipboard
                .writeText(text)
                .then(() => toast.success("Copied to clipboard!"));
            }}
          />
        </TooltipTrigger>
        <TooltipContent>Copy to Clipboard</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Edit = ({ versionId, text }: { versionId: string; text: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(text);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await saveSelfEdit(versionId, editText);
    setLoading(false);
    if (response) {
      toast.error("An error occurred.", {
        description: response.message,
        action: {
          label: "Retry",
          onClick: handleSubmit,
        },
      });
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <PenLine
                aria-label="Edit this version"
                className="cursor-pointer h-5 w-5"
                onClick={() => {
                  setOpen(true);
                }}
              />
            </TooltipTrigger>
            <TooltipContent>Edit this version</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit this version</DialogTitle>
        </DialogHeader>
        <Textarea
          className="h-[50svh]"
          value={editText}
          autoFocus
          onChange={(e) => setEditText(e.target.value)}
        />
        <DialogFooter>
          <Button
            disabled={loading}
            className="cursor-pointer self-end"
            onClick={handleSubmit}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PassageContent = ({ content }: PassageContentProps) => (
  <article>
    {content.map((diff, index) => (
      <p key={index} className="leading-relaxed mb-4 last:mb-0">
        {diff.map((diff, index) => (
          <DiffWord diff={diff} key={index} />
        ))}
      </p>
    ))}
  </article>
);

const PassageCard = ({
  version,
  isEdit = false,
  children,
}: PropsWithChildren<PassageCardProps>) => {
  return (
    <Card className="flex-1 h-fit">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="capitalize flex items-center gap-1">
            {version.edit === "ORIGINAL"
              ? "original"
              : `${version.edit.toLowerCase()} edit`}
            <Copy text={version.text} />
          </span>
          <time
            className="text-md font-normal text-slate-500"
            suppressHydrationWarning
          >
            {version.createdAt.toLocaleTimeString("en-ca", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </CardTitle>
        <CardDescription>
          {!isEdit
            ? "This is the text before editing."
            : "This is the text after editing."}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-end">
        <Edit versionId={version.id} text={version.text} />
      </CardFooter>
    </Card>
  );
};

const PassageBody = ({ original, edit }: PassageBodyProps) => {
  const { original: originalDiffs, edit: editDiffs } = getDiff(
    original.text,
    edit.text,
  );
  const isSm = useMediaQuery("(min-width: 640px)");

  return isSm ? (
    <>
      <PassageCard version={original}>
        <PassageContent content={originalDiffs} />
      </PassageCard>
      <PassageCard version={edit} isEdit>
        <PassageContent content={editDiffs} />
      </PassageCard>
    </>
  ) : (
    <Tabs defaultValue="original">
      <TabsList>
        <TabsTrigger value="original">Original</TabsTrigger>
        <TabsTrigger value="edit">Edit</TabsTrigger>
      </TabsList>
      <TabsContent value="original">
        <PassageCard version={original}>
          <PassageContent content={originalDiffs} />
        </PassageCard>
      </TabsContent>
      <TabsContent value="edit">
        <PassageCard version={edit} isEdit>
          <PassageContent content={editDiffs} />
        </PassageCard>
      </TabsContent>
    </Tabs>
  );
};

const Feedback = ({ feedback }: { feedback: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Feedback</CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert w-full">
        <Markdown>{feedback}</Markdown>
      </CardContent>
    </Card>
  );
};

export const Passage = ({ passage }: PassageProps) => {
  const original = passage.versions[passage.versions.length - 2];
  const edit = passage.versions[passage.versions.length - 1];

  return (
    <main className="max-w-sm sm:w-full sm:max-w-2xl">
      <div className="flex justify-between gap-4 mb-2 items-baseline">
        <span className="flex flex-col p-1">
          <PassageTitle passage={passage} />
          <time
            className="text-xl text-slate-500 dark:text-slate-100"
            suppressHydrationWarning
          >
            {passage.createdAt.toLocaleDateString("en-ca")}
          </time>
        </span>
        <span className="flex flex-col sm:flex-row gap-2">
          <PassageAction version={edit} />
          <RevertDialog versionId={edit.id} />
        </span>
      </div>
      <div className="flex justify-center my-4 gap-4">
        <PassageBody original={original} edit={edit} />
      </div>
      {edit.feedback && <Feedback feedback={edit.feedback} />}
    </main>
  );
};
