"use client";
import { PassagePair } from "@/lib/types";
import { passageToDiff } from "@/lib/utils";
import PassageCard from "@/components/passage-card";

type DiffProps = {
  pair: PassagePair;
};

function DiffPassage({ pair }: DiffProps) {
  const diff = passageToDiff(pair);

  return <PassageCard diff={diff} />;
}

export default DiffPassage;
