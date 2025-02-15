"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { DiffWord, Subtitle, Title } from "@/components/typography";
import EditDropdown from "@/components/edit-dropdown";
import { AnimatePresence, motion } from "motion/react";
import { LoadingSpinner } from "@/components/loading";
import { DialogueWithVersion } from "@/lib/types";
import { changeTitle, getDialogue } from "@/actions/edit";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PassageCardProps = {
  original: Version;
  edit: Version;
};

type PassageProps = {
  passageId: string;
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

const PassageCard = ({ original, edit }: PassageCardProps) => {
  const { original: originalDiffs, edit: editDiffs } = getDiff(
    original.text,
    edit.text,
  );
  const originalHTML = renderPassage(originalDiffs, "o");
  const editHTML = renderPassage(editDiffs, "e");

  return (
    <div className="flex gap-5 flex-1">
      <Card className="my-5 w-1/2">
        <CardHeader>
          <CardTitle className="flex justify-between align-baseline">
            <span className="capitalize">Previous version</span>
            <span className="text-md font-normal text-slate-500">
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
            <span className="text-md font-normal text-slate-500">
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
};

function Passage({ passageId }: PassageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [passage, setPassage] = useState<DialogueWithVersion>();
  const router = useRouter();
  const ref = useRef<HTMLSpanElement>(null);

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

  const saveTitle = async () => {
    if (!ref.current) return;
    const title = ref.current.innerText.trim();
    if (title === "") ref.current.innerText = "Untitled document";

    if (title === passage?.title) return;
    const response = await changeTitle(passageId, title);
    if (response) {
      toast.error("An error occurred.", {
        description: response.message,
      });
    }
  };

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
              <Title>
                <span
                  ref={ref}
                  className="rounded-xl p-1"
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" ||
                      e.key === "Escape" ||
                      e.key === "Tab"
                    ) {
                      e.preventDefault();
                      ref.current?.blur();
                    }
                  }}
                  onBlur={() => saveTitle()}
                >
                  {!!passage?.title ? passage.title : "Untitled document"}
                </span>
              </Title>
              <Subtitle className="text-slate-500">
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
