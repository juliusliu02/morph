import { motion, useScroll, useTransform } from "motion/react";
import React, { useRef } from "react";
import type { MotionValue } from "motion/react";

const Paragraph = ({ paragraph }: { paragraph: string }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = paragraph.split(" ");
  return (
    <p
      ref={container}
      className="text-slate-900 dark:text-slate-50 text-4xl sm:text-6xl leading-none font-bold flex flex-wrap"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

type WordProps = {
  progress: MotionValue;
  range: [number, number];
};

const Word = ({
  children,
  progress,
  range,
}: React.PropsWithChildren<WordProps>) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mt-2 mr-2 sm:mt-3 sm:mr-3">
      <span className="absolute opacity-20">{children + " "}</span>
      <motion.span style={{ opacity: opacity }}>{children + " "}</motion.span>
    </span>
  );
};

const paragraph = `A fast, smart, and opinionated editor that seamlessly integrates into your workflow.`;

const TextScroll = () => {
  return (
    <section className="mt-12 h-[80vh]">
      <Paragraph paragraph={paragraph} />
    </section>
  );
};

export default TextScroll;
