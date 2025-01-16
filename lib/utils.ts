import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Diff, DiffMatchPatch } from "diff-match-patch-ts";
import { PassagePair } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const diff = new DiffMatchPatch();

export const passageToDiff = (pair: PassagePair): Diff[] => {
  const { original, edit } = pair;
  const result = diff.diff_main(original, edit);
  diff.diff_cleanupSemantic(result);
  return result;
};
