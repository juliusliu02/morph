import React from "react";
import { Dialogue } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <div className="flex justify-between w-full dark:text-gray-200">
        <span>
          {passage.title !== "" ? passage.title : "Untitled document"}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          {passage.createdAt.toLocaleDateString("en-ca")}
        </span>
      </div>
    </Link>
  );
};

const PassageList = ({ passages }: PassageListProps) => {
  return (
    <section className="flex flex-col bg-white dark:bg-slate-950 max-w-2xl mx-auto">
      {passages.map((passage, index) => (
        <PassageListItem key={index} passage={passage} />
      ))}
    </section>
  );
};

export default PassageList;
