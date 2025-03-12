"use client";
import React, { useRef } from "react";
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
import { getDiff } from "@/lib/utils";
import { PassageContent } from "@/components/passage";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

type PassageCardProps = {
  original?: string;
  edit: (typeof LandingEdits)[number];
  index: number;
  dataLength: number;
  scrollYProgress: MotionValue<number>;
};

const MobilePassageCard = ({
  original,
  edit,
  index,
  dataLength,
  scrollYProgress,
}: PassageCardProps) => {
  const diffs = original ? getDiff(original, edit.text) : undefined;
  const exitRange = [index / dataLength, 1];
  const style = {
    translateY: useTransform(scrollYProgress, exitRange, [
      "0",
      -6 * (dataLength - index) + "vh",
    ]),
    scale: useTransform(scrollYProgress, exitRange, [
      1,
      1 - 0.1 * (dataLength - index),
    ]),
  };

  return (
    <div className="sticky top-[15vh] h-screen flex justify-center items-center">
      <motion.div style={style} className="h-screen">
        <Card className="h-fit flex-1 w-full relative">
          <CardHeader className="pb-4">
            <CardTitle className="text-center capitalize">
              {edit.type.toLowerCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
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

const DesktopPassageCard = ({
  original,
  edit,
  index,
  dataLength,
  scrollYProgress,
}: PassageCardProps) => {
  const diffs = original ? getDiff(original, edit.text) : undefined;

  const enterRange = [(index - 1) / dataLength, index / dataLength];
  // slightly delay exit animation to when the card is at the center
  const exitRange = [(index + 0.2) / dataLength, 1];
  const style = {
    scale: useTransform(scrollYProgress, enterRange, [2, 1]),
    opacity: useTransform(scrollYProgress, enterRange, [0, 1]),
    rotate: useTransform(scrollYProgress, exitRange, [
      0,
      (dataLength - index - 1) * -15,
    ]),
  };

  return (
    <div className="sticky -top-4 h-screen flex justify-center items-center">
      <motion.div style={style} className="relative h-[36rem]">
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
  const isDesktop = useMediaQuery("(min-width: 640px) and (min-height: 768px)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const data = LandingEdits;

  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
      }}
      className="mt-12 sm:p-4 relative flex flex-col items-center"
    >
      <h2 className="px-8 pb-[50vh] text-2xl sm:text-4xl font-semibold sticky top-4 sm:top-12 text-center text-slate-900 dark:text-slate-50">
        Make modular and incisive edits in seconds.
      </h2>

      <div
        ref={ref}
        className={isDesktop ? "mt-[-60vh]" : "mt-[calc(-50vh+2rem)]"}
      >
        {data.map((edit, i) =>
          isDesktop ? (
            <DesktopPassageCard
              original={i > 0 ? data[i - 1].text : undefined}
              edit={edit}
              key={i}
              index={i}
              dataLength={data.length}
              scrollYProgress={scrollYProgress}
            />
          ) : (
            <MobilePassageCard
              original={i > 0 ? data[i - 1].text : undefined}
              edit={edit}
              key={i}
              index={i}
              dataLength={data.length}
              scrollYProgress={scrollYProgress}
            />
          ),
        )}
      </div>
    </motion.section>
  );
};

export default CardStack;
