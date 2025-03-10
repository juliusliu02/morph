"use client";
import { motion } from "motion/react";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Intro() {
  return (
    <section>
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
        className="mt-8 mx-10 text-lg sm:text-2xl text-center text-slate-700 dark:text-slate-200"
      >
        Produce error-free and elevated passages in one click with Morph.
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
            "mt-10 rounded-full font-semibold hover:scale-105 transition duration-200 will-change-transform",
          )}
          href="/signup"
        >
          Start for free
        </Link>
      </motion.div>
    </section>
  );
}
