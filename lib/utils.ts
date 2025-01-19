import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Diff, DiffMatchPatch } from "diff-match-patch-ts";
import { Version } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const diff = new DiffMatchPatch();

export const getDiff = (original: Version, edit: Version): Diff[] => {
  const result = diff.diff_main(original.text, edit.text);
  diff.diff_cleanupSemantic(result);
  return result;
};
