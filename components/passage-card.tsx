import React from "react";
import { Diff, DiffOp } from "diff-match-patch-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { passageToDiff } from "@/lib/utils";
import { PassagePair } from "@/lib/types";

type PassageCardProps = {
  pair: PassagePair;
};

const DeleteText = ({ children }: React.PropsWithChildren) => {
  return <span className="line-through text-gray-400">{children}</span>;
};

const EqualText = ({ children }: React.PropsWithChildren) => {
  return <span className="">{children}</span>;
};

const InsertText = ({ children }: React.PropsWithChildren) => {
  return <span className="bg-indigo-400 text-gray-100">{children}</span>;
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

const renderPassage = (diffs: Diff[], keyPrefix: string) => {
  const paragraphs: React.ReactNode[] = [];
  let currentParagraph: React.ReactNode[] = [];
  diffs.map((diff: Diff, index: number) => {
    if (diff[1].includes("\n")) {
      diff[1] = diff[1].replace("\n", "");
      currentParagraph.push(WordChunk(diff, keyPrefix + index));
      paragraphs.push(<p>{...currentParagraph}</p>);
      currentParagraph = [];
    } else {
      currentParagraph.push(WordChunk(diff, keyPrefix + index));
    }
  });
  if (currentParagraph.length > 0) {
    paragraphs.push(<p>{...currentParagraph}</p>);
  }
  return <>{...paragraphs}</>;
};

function PassageCard({ pair }: PassageCardProps) {
  const diff = passageToDiff(pair);

  const originalDiff = diff.filter((d: Diff) => d[0] != DiffOp.Insert);
  const original = renderPassage(originalDiff, "o");

  const editDiff = diff.filter((d: Diff) => d[0] !== DiffOp.Delete);
  const edit = renderPassage(editDiff, "e");
  console.log(editDiff);

  return (
    <div className="flex gap-5 flex-1">
      <Card className="my-5">
        <CardHeader>
          <CardTitle>Original</CardTitle>
          <CardDescription>This is the text before editing.</CardDescription>
        </CardHeader>
        <CardContent>{original}</CardContent>
      </Card>

      <Card className="my-5">
        <CardHeader>
          <CardTitle>Edit</CardTitle>
          <CardDescription>This is the text after editing.</CardDescription>
        </CardHeader>
        <CardContent>{edit}</CardContent>
      </Card>
    </div>
  );
}

export default PassageCard;
