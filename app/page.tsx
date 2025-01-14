"use client";
import InputPassageForm from "@/components/input-passage-form";
import { useState } from "react";
import { PassagePair } from "@/lib/types";
import DiffPassage from "@/components/diff-passage";

function Home() {
  const [firstPass, setFirstPass] = useState<PassagePair | null>(null);

  if (firstPass !== null) {
    return <DiffPassage pair={firstPass}></DiffPassage>;
  }

  return <InputPassageForm setFirstPass={setFirstPass} />;
}

export default Home;
