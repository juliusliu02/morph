import React from "react";
import { Diff, DiffOp } from "diff-match-patch-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PassageProps = {
  diff: Diff[];
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

const renderPassage = (diff: Diff, key: string): React.ReactNode => {
  switch (diff[0]) {
    case DiffOp.Delete:
      return <DeleteText key={key}>{diff[1]}</DeleteText>;
    case DiffOp.Insert:
      return <InsertText key={key}>{diff[1]}</InsertText>;
    case DiffOp.Equal:
      return <EqualText key={key}>{diff[1]}</EqualText>;
  }
};

function PassageCard({ diff }: PassageProps) {
  const original = diff
    .filter((d: Diff) => d[0] != DiffOp.Insert)
    .map((diff, index) => renderPassage(diff, "o" + index));

  const edit = diff
    .filter((d: Diff) => d[0] !== DiffOp.Delete)
    .map((diff, index) => renderPassage(diff, "e" + index));

  return (
    <div className="flex gap-5">
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
