"use client";
import InputPassageForm from "@/components/input-passage-form";
import { useState } from "react";
import { PassagePair } from "@/lib/types";
import Page from "@/app/grammar-edit/page";

function Home() {
  const [firstPass, setFirstPass] = useState<PassagePair | null>(null);

  if (firstPass !== null) {
    return <Page pair={firstPass}></Page>;
  }

  return <InputPassageForm setFirstPass={setFirstPass} />;
}

export default Home;
