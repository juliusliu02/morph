"use client";
import React, { useEffect } from "react";
import Intro from "@/components/landing/intro";
import CardStack from "@/components/landing/card-stack";
import Lenis from "lenis";
import Footer from "@/components/landing/footer";
import TextScroll from "@/components/landing/text-scroll";

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
      <main className="max-w-4xl flex flex-col items-center px-10">
        <Intro />
        <CardStack />
        <TextScroll />
        <Footer />
      </main>
    </div>
  );
}

export default Page;
