import React from "react";
import { Dialogue } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type PassageListProps = {
  passages: Dialogue[];
};

type PassageListItemProps = {
  passage: Dialogue;
};

const PassageListItem = ({ passage }: PassageListItemProps) => {
  return (
    <Link
      className={buttonVariants({ variant: "ghost" })}
      href={`/passages/${passage.id}`}
    >
      <div className="flex justify-between w-full">
        <span>
          {passage.title !== "" ? passage.title : "Untitled document"}
        </span>
        <span className="text-gray-600">
          {passage.createdAt.toLocaleDateString("en-ca")}
        </span>
      </div>
    </Link>
  );
};

const PassageList = ({ passages }: PassageListProps) => {
  return (
    <section className="flex flex-col bg-white max-w-2xl mx-auto">
      {passages.map((passage, index) => (
        <PassageListItem key={index} passage={passage} />
      ))}
    </section>
  );
};

export default PassageList;
