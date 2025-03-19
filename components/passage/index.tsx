"use client";
import { type PropsWithChildren, useRef } from "react";
import type { Diff } from "diff-match-patch-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDiff } from "@/lib/utils";
import type { Version } from "@prisma/client";
import { DiffWord, Title } from "@/components/typography";
import type { DialogueWithVersion } from "@/lib/db/types";
import { changeTitle } from "@/actions/dialogue";
import { toast } from "sonner";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EditOptions,
  RevertDialog,
  SelfEditDialog,
  Copy,
} from "@/components/passage/passage-action";
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

export const PassageContent = ({ content }: PassageContentProps) => (
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
            className="text-md font-normal text-slate-500 dark:text-slate-400"
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
        <SelfEditDialog versionId={version.id} text={version.text} />
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
            className="text-xl text-slate-600 dark:text-slate-300"
            suppressHydrationWarning
          >
            {passage.createdAt.toLocaleDateString("en-ca")}
          </time>
        </span>
        <span className="flex flex-col sm:flex-row gap-2">
          <EditOptions version={edit} />
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
