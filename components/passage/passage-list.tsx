import React from "react";
import type { Dialogue } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PassageListItemAction from "@/components/passage/passage-list-item-action";

type PassageListProps = {
  passages: Dialogue[];
};

type PassageListItemProps = {
  passage: Dialogue;
  index: number;
};

const PassageListItem = ({ passage, index }: PassageListItemProps) => {
  return (
    <li>
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "dark:bg-slate-950 flex justify-between items-baseline w-full dark:text-gray-200 gap-2",
        )}
        href={`/app/passages/${passage.id}`}
        prefetch={index < 3 ? true : null}
      >
        <span className="overflow-hidden overflow-ellipsis">
          {passage.title !== "" ? passage.title : "Untitled document"}
        </span>
        <span className="text-gray-600 dark:text-gray-400 flex gap-2">
          {passage.createdAt.toLocaleDateString("en-ca")}
          <PassageListItemAction id={passage.id} />
        </span>
      </Link>
    </li>
  );
};

const PassageList = ({ passages }: PassageListProps) => {
  return (
    <ul className="flex flex-col bg-white dark:bg-slate-950">
      {passages.map((passage, index) => (
        <PassageListItem key={index} index={index} passage={passage} />
      ))}
    </ul>
  );
};

export default PassageList;
