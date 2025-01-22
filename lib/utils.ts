import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Diff, DiffMatchPatch } from "diff-match-patch-ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const diff = new DiffMatchPatch();

export const getDiff = (original: string, edit: string): Diff[] => {
  const result = diff.diff_main(original, edit);
  diff.diff_cleanupEfficiency(result);
  return result;
};
