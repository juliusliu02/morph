"use client";
import React, { useRef } from "react";
import { Diff } from "diff-match-patch-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDiff } from "@/lib/utils";
import { Version } from "@prisma/client";
import { DiffWord, Title } from "@/components/typography";
import { DialogueWithVersion } from "@/lib/types";
import { changeTitle } from "@/actions/edit";
import { toast } from "sonner";
import { ClipboardCopy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export function PassageTitle({ passage }: PassageTitleProps) {
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
        className="rounded-xl p-1"
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

const PassageCard = ({ version, html }: PassageCardProps) => {
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
        <CardDescription>This is the text before editing.</CardDescription>
      </CardHeader>
      <CardContent>
        <article>{html}</article>
      </CardContent>
    </Card>
  );
};

export const PassageBody = ({ original, edit }: PassageBodyProps) => {
  const { original: originalDiffs, edit: editDiffs } = getDiff(
    original.text,
    edit.text,
  );
  const originalHTML = renderPassage(originalDiffs, "o");
  const editHTML = renderPassage(editDiffs, "e");

  return (
    <div className="flex gap-5 flex-1">
      <div className="my-5 w-1/2">
        <PassageCard version={original} html={originalHTML} />
      </div>
      <div className="my-5 w-1/2">
        <PassageCard version={edit} html={editHTML} />
      </div>
    </div>
  );
};
