import React from "react";
import { Diff, DiffOp } from "diff-match-patch-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDiff } from "@/lib/utils";
import { Version } from "@prisma/client";

type PassageCardProps = {
  original: Version;
  edit: Version;
};

const DeleteText = ({ children }: React.PropsWithChildren) => {
  return <span className="line-through text-gray-400">{children}</span>;
};

const EqualText = ({ children }: React.PropsWithChildren) => {
  return <span>{children}</span>;
};

const InsertText = ({ children }: React.PropsWithChildren) => {
  return <span className="text-indigo-800 font-semibold">{children}</span>;
};

const WordChunk = (diff: Diff, key: string): React.ReactNode => {
  switch (diff[0]) {
    case DiffOp.Delete:
      return <DeleteText key={key}>{diff[1]}</DeleteText>;
    case DiffOp.Insert:
      return <InsertText key={key}>{diff[1]}</InsertText>;
    case DiffOp.Equal:
      return <EqualText key={key}>{diff[1]}</EqualText>;
  }
};

const renderPassage = (diffs: Diff[][], keyPrefix: string) => {
  return diffs.map((diff, pIndex) => (
    <p
      key={keyPrefix + pIndex}
      className="leading-relaxed mb-4 last:mb-0 tracking-[.001rem]"
    >
      {diff.map((diff, wIndex) =>
        WordChunk(diff, keyPrefix + pIndex + "w" + wIndex),
      )}
    </p>
  ));
};

function PassageCard({ original, edit }: PassageCardProps) {
  let originalParagraphs = original.text.split("\n\n");
  let editedParagraphs = edit.text.split("\n\n");

  if (originalParagraphs.length !== editedParagraphs.length) {
    // AI fails to generate line breaks.
    // consolidate into one paragraph.
    originalParagraphs = [original.text.replaceAll("\n", " ")];
    editedParagraphs = [edit.text.replaceAll("\n", " ")];
  }

  const diffs = originalParagraphs.map((p, index) =>
    getDiff(p, editedParagraphs[index]),
  );

  const originalDiffs = diffs.map((diff) =>
    diff.filter((d: Diff) => d[0] != DiffOp.Insert),
  );
  const originalHTML = renderPassage(originalDiffs, "o");

  const editDiffs = diffs.map((diff) =>
    diff.filter((d: Diff) => d[0] != DiffOp.Delete),
  );
  const editHTML = renderPassage(editDiffs, "e");

  return (
    <div className="flex gap-5 flex-1">
      <Card className="my-5 w-1/2">
        <CardHeader>
          <CardTitle>Original</CardTitle>
          <CardDescription>This is the text before editing.</CardDescription>
        </CardHeader>
        <CardContent>{originalHTML}</CardContent>
      </Card>

      <Card className="my-5 w-1/2">
        <CardHeader>
          <CardTitle className="capitalize">
            {edit.edit.toString().toLowerCase()} edit
          </CardTitle>
          <CardDescription>
            This is the text after editing.
          </CardDescription>
        </CardHeader>
        <CardContent>{editHTML}</CardContent>
      </Card>
    </div>
  );
}

export default PassageCard;
