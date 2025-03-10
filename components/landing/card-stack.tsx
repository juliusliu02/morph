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
import { useMediaQuery } from "@/lib/hooks/use-media-query";

type PassageCardProps = {
  original?: string;
  edit: (typeof LandingEdits)[number];
  index: number;
  dataLength: number;
  scrollYProgress: MotionValue<number>;
};

const PassageCard = ({
  original,
  edit,
  index,
  dataLength,
  scrollYProgress,
}: PassageCardProps) => {
  const isSm = useMediaQuery("(min-width: 640px)");
  const diffs = original ? getDiff(original, edit.text) : undefined;
  const enterRange = [
    max((index - 0.75) / dataLength, 0),
    (index + 0.25) / dataLength,
  ]; // use max for the first card
  const exitRange = [(index + 0.25) / dataLength, 1];

  const mobile = {
    translateY: useTransform(scrollYProgress, exitRange, [
      0,
      -50 * (dataLength - index),
    ]),
    scale: useTransform(scrollYProgress, exitRange, [
      1,
      1 - 0.05 * (dataLength - index),
    ]),
  };

  const desktop = {
    scale: useTransform(scrollYProgress, enterRange, [2, 1]),
    opacity: useTransform(scrollYProgress, enterRange, [0, 1]),
    rotate: useTransform(scrollYProgress, exitRange, [
      0,
      (dataLength - index - 1) * -15,
    ]),
    translateY: useTransform(scrollYProgress, enterRange, [100, 0]),
  };

  return (
    <div className="sticky top-28 h-screen flex justify-center items-center">
      <motion.div
        style={isSm ? desktop : mobile}
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
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
      }}
      ref={ref}
      className="mt-12 p-4 flex flex-col items-center mb-96 relative"
    >
      <h1 className="mb-20 text-2xl sm:text-3xl font-semibold sticky top-8 text-center text-slate-900 dark:text-slate-50">
        Make modular and incisive edits in seconds.
      </h1>
      {data.map((edit, i) => (
        <PassageCard
          original={i > 0 ? data[i - 1].text : undefined}
          edit={edit}
          key={i}
          index={i}
          dataLength={data.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </motion.section>
  );
};

export default CardStack;
