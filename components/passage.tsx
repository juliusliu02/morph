"use client";
import React, { useEffect, useState } from "react";
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
import { Subtitle, Title } from "@/components/typography";
import EditDropdown from "@/components/edit-dropdown";
import { AnimatePresence, motion } from "motion/react";
import { LoadingSpinner } from "@/components/loading";
import { DialogueWithVersion } from "@/lib/types";
import { getDialogue } from "@/actions/edit";
import { useRouter } from "next/navigation";

type PassageCardProps = {
  original: Version;
  edit: Version;
};

type PassageProps = {
  passageId: string;
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
          <CardTitle className="flex justify-between align-baseline">
            <span className="capitalize">Previous version</span>
            <span className="text-md font-normal text-gray-500">
              {original.createdAt.toLocaleTimeString("en-ca", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </CardTitle>
          <CardDescription>This is the text before editing.</CardDescription>
        </CardHeader>
        <CardContent>
          <article>{originalHTML}</article>
        </CardContent>
      </Card>

      <Card className="my-5 w-1/2">
        <CardHeader>
          <CardTitle className="flex justify-between align-baseline">
            <span className="capitalize">
              {edit.edit.toString().toLowerCase()} edit
            </span>
            <span className="text-md font-normal text-gray-500">
              {edit.createdAt.toLocaleTimeString("en-ca", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </CardTitle>
          <CardDescription>This is the text after editing.</CardDescription>
        </CardHeader>
        <CardContent>
          <article>{editHTML}</article>
        </CardContent>
      </Card>
    </div>
  );
}

function Passage({ passageId }: PassageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [passage, setPassage] = useState<DialogueWithVersion>();
  const router = useRouter();

  useEffect(() => {
    if (!passage) {
      getDialogue(passageId)
        .then((response) => {
          setPassage(response);
          setIsLoading(false);
        })
        .catch((e) => {
          console.error(e);
          router.push("/notfound");
        });
    }

    if (passage) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [passage, passageId, router]);

  return (
    <div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            className="min-h-svh w-full flex justify-center items-center"
            key="loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex gap-5 items-baseline">
              <Title>{passage!.title || "Untitled document"}</Title>
              <Subtitle className="text-gray-500">
                {passage!.createdAt.toLocaleString("en-ca")}
              </Subtitle>
            </div>
            <PassageCard
              original={passage!.versions[passage!.versions.length - 2]}
              edit={passage!.versions[passage!.versions.length - 1]}
            />
            <EditDropdown
              original={passage!.versions[passage!.versions.length - 1]}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Passage;
