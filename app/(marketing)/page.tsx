"use client";
import React, { useEffect } from "react";
import Intro from "@/components/landing/intro";
import CardStack from "@/components/landing/card-stack";
import Prompt from "@/components/landing/prompt";
import Lenis from "lenis";

function Page() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  return (
    <div className="pt-32 flex justify-center">
      <main className="max-w-3xl flex flex-col items-center px-10">
        <Intro />
        <CardStack />
        <Prompt />
      </main>
    </div>
  );
}

export default Page;
