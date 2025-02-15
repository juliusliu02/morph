import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Diff, DiffMatchPatch, DiffOp } from "diff-match-patch-ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const diff = new DiffMatchPatch();

export const getDiff = (originalText: string, editText: string) => {
  const original = originalText.replaceAll(/\n+/g, "\n");
  const edit = editText.replaceAll(/\n+/g, "\n");
  const diffResult = diff.diff_main(original, edit);
  diff.diff_cleanupEfficiency(diffResult);

  const originalDiffs = diffResult.filter((d: Diff) => d[0] != DiffOp.Insert);
  const editDiffs = diffResult.filter((d: Diff) => d[0] != DiffOp.Delete);

  return {
    original: splitDiffs(originalDiffs),
    edit: splitDiffs(editDiffs),
  };
};

const splitDiffs = (diffs: Diff[]): Diff[][] => {
  const paragraphs: Diff[][] = [[]];
  diffs.forEach((diff) => {
    const pieces = diff[1].split("\n");
    if (pieces.length === 1) {
      paragraphs[paragraphs.length - 1].push(diff);
      return;
    }

    for (const piece of pieces) {
      if (piece === "") {
        paragraphs.push([]);
      } else {
        paragraphs[paragraphs.length - 1].push([diff[0], piece]);
        paragraphs.push([]);
      }
    }
    paragraphs.pop();
  });
  return paragraphs;
};
