"use client";
import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LandingEdits } from "@/public/data";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Lenis from "lenis";
import { getDiff } from "@/lib/utils";
import { PassageContent } from "@/components/passage";
import { max } from "@floating-ui/utils";

type PassageCardProps = {
  original?: string;
  edit: (typeof LandingEdits)[number];
  enterRange: [number, number];
  exitRange: [number, number];
  targetDegree: number;
  scrollYProgress: MotionValue<number>;
};

const PassageCard = ({
  original,
  edit,
  enterRange,
  exitRange,
  targetDegree,
  scrollYProgress,
}: PassageCardProps) => {
  const rotate = useTransform(scrollYProgress, exitRange, [0, -targetDegree]);
  const scale = useTransform(scrollYProgress, enterRange, [2, 1]);
  const translateY = useTransform(scrollYProgress, enterRange, [100, 0]);
  const opacity = useTransform(scrollYProgress, enterRange, [0, 1]);
  const diffs = original ? getDiff(original, edit.text) : undefined;

  return (
    <div className="sticky top-24 h-screen flex justify-center items-center">
      <motion.div
        style={{ rotate, scale, opacity, translateY }}
        className="top-[-10%] relative sm:h-[36rem]"
      >
        <Card className="h-full flex-1 w-full max-w-md relative p-2">
          <CardHeader>
            <CardTitle className="text-center capitalize text-xl">
              {edit.type.toLowerCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="leading-relaxed">
            {diffs ? (
              <PassageContent content={diffs.edit} />
            ) : (
              <p>{edit.text}</p>
            )}
          </CardContent>
          {edit.footnote && (
            <CardFooter className="text-slate-600 dark:text-slate-300 text-sm">
              *{edit.footnote}
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

const CardStack = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  const data = LandingEdits;
  return (
    <section ref={ref} className="mt-12 p-4 flex flex-col items-center mb-96">
      <h1 className="mb-20 text-2xl sm:text-3xl font-semibold sticky top-8 text-center">
        Make modular and incisive edits in seconds.
      </h1>
      {data.map((edit, i) => (
        <PassageCard
          original={i > 0 ? data[i - 1].text : undefined}
          edit={edit}
          key={i}
          enterRange={[
            max((i - 0.5) / data.length, 0),
            (i + 0.5) / data.length + +0.1,
          ]}
          exitRange={[i / data.length + 0.1, 1]}
          targetDegree={(data.length - i - 1) * 15}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </section>
  );
};

export default CardStack;
