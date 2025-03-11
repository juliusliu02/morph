"use client";
import { motion } from "motion/react";
import React, { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(
      () => ref.current?.classList.remove("will-change-transform"),
      // remove will-change after entry animation
      1000,
    );
  }, []);

  return (
    <section ref={ref} className="will-change-transform">
      <motion.h1
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-slate-900 dark:text-slate-50 text-center font-extrabold text-3xl leading-snug sm:text-5xl"
      >
        Streamline your multi-step essay polishing
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
        className="mt-8 mx-10 text-lg sm:text-xl text-center text-slate-700 dark:text-slate-200"
      >
        Produce error-free and elevated passages in one click without hassle.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
        }}
        className="flex justify-center"
      >
        <Link
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-10 rounded-full font-semibold hover:scale-105 transition duration-200",
          )}
          href="/signup"
        >
          Start for free
        </Link>
      </motion.div>
    </section>
  );
}
