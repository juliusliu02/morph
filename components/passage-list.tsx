import React from "react";
import { Dialogue } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PassageDropdown from "@/components/passage-action";

type PassageListProps = {
  passages: Dialogue[];
};

type PassageListItemProps = {
  passage: Dialogue;
};

const PassageListItem = ({ passage }: PassageListItemProps) => {
  return (
    <Link
      className={cn(buttonVariants({ variant: "ghost" }), "dark:bg-slate-950")}
      href={`/passages/${passage.id}`}
    >
      <li className="flex justify-between items-baseline w-full dark:text-gray-200 gap-2">
        <span className="overflow-hidden overflow-ellipsis">
          {passage.title !== "" ? passage.title : "Untitled document"}
        </span>
        <span className="text-gray-600 dark:text-gray-400 flex gap-2">
          {passage.createdAt.toLocaleDateString("en-ca")}
          <PassageDropdown id={passage.id} />
        </span>
      </li>
    </Link>
  );
};

const PassageList = ({ passages }: PassageListProps) => {
  return (
    <ul className="flex flex-col bg-white dark:bg-slate-950">
      {passages.map((passage, index) => (
        <PassageListItem key={index} passage={passage} />
      ))}
    </ul>
  );
};

export default PassageList;
