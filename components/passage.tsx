"use client";
import React, { useRef } from "react";
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
import { DiffWord, Subtitle, Title } from "@/components/typography";
import { DialogueWithVersion } from "@/lib/types";
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
import { useMediaQuery } from "@/lib/hooks";
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

type PassageBodyProps = {
  original: Version;
  edit: Version;
};

type PassageTitleProps = {
  passage: DialogueWithVersion;
};

type PassageCardProps = {
  version: Version;
  html: React.JSX.Element[];
  isEdit?: boolean;
};

function PassageTitle({ passage }: PassageTitleProps) {
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
    <Title>
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
}

const Copy = ({ text }: { text: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <ClipboardCopy
            className="cursor-pointer translate-y-[-1px]"
            size="1.25rem"
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
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editText, setEditText] = React.useState<string>(text);

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
                className="cursor-pointer"
                size="1.25rem"
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
            className="cursor-pointer"
            onClick={handleSubmit}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const renderPassage = (diffs: Diff[][], keyPrefix: string) => {
  return diffs.map((diff, pIndex) => (
    <p key={keyPrefix + pIndex} className="leading-relaxed mb-4 last:mb-0">
      {diff.map((diff, wIndex) => (
        <DiffWord diff={diff} key={keyPrefix + pIndex + "w" + wIndex} />
      ))}
    </p>
  ));
};

const PassageCard = ({ version, html, isEdit = false }: PassageCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="capitalize flex items-center gap-1">
            {version.edit === "ORIGINAL"
              ? "original"
              : `${version.edit.toLowerCase()} edit`}
            <Copy text={version.text} />
          </span>
          <span className="text-md font-normal text-slate-500">
            {version.createdAt.toLocaleTimeString("en-ca", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </CardTitle>
        <CardDescription>
          {!isEdit
            ? "This is the text before editing."
            : "This is the text after editing."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <article>{html}</article>
      </CardContent>
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
  const originalHTML = renderPassage(originalDiffs, "o");
  const editHTML = renderPassage(editDiffs, "e");
  const isSm = useMediaQuery("(min-width: 640px)");

  return isSm ? (
    <div className="flex gap-5 flex-1">
      <div className="my-5 w-1/2">
        <PassageCard version={original} html={originalHTML} />
      </div>
      <div className="my-5 w-1/2">
        <PassageCard version={edit} html={editHTML} isEdit />
      </div>
    </div>
  ) : (
    <div className="flex justify-center">
      <Tabs defaultValue="original" className="w-sm">
        <TabsList>
          <TabsTrigger value="original">Original</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>
        <TabsContent value="original">
          <PassageCard version={original} html={originalHTML} />
        </TabsContent>
        <TabsContent value="edit">
          <PassageCard version={edit} html={editHTML} isEdit />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Feedback = ({ feedback }: { feedback: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Feedback</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-slate min-w-full">
        <Markdown>{feedback}</Markdown>
      </CardContent>
    </Card>
  );
};

export function Passage({ passage }: PassageProps) {
  const original = passage.versions[passage.versions.length - 2];
  const edit = passage.versions[passage.versions.length - 1];

  return (
    <div
      className="w-sm
      sm:w-full sm:max-w-2xl"
    >
      <div className="flex justify-between mb-2">
        <span
          className="flex flex-col p-1 mr-5
          sm:flex-row sm:gap-5 sm:items-baseline"
        >
          <PassageTitle passage={passage} />
          <Subtitle className="text-slate-500">
            {passage.createdAt.toLocaleDateString("en-ca")}
          </Subtitle>
        </span>
        <span className="translate-y-0.5 flex gap-2 items-baseline">
          <PassageAction version={edit} />
          <RevertDialog versionId={edit.id} />
        </span>
      </div>
      <PassageBody original={original} edit={edit} />
      {edit.feedback && <Feedback feedback={edit.feedback} />}
    </div>
  );
}
