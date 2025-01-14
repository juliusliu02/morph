import { DiffMatchPatch } from "diff-match-patch-ts";
import { PassagePair } from "@/lib/types";

type DiffProps = {
  pair: PassagePair;
};

const diff = new DiffMatchPatch();

function DiffPassage({ pair }: DiffProps) {
  const { original, edit } = pair;
  const result = diff.diff_main(original, edit);
  diff.diff_cleanupSemantic(result);
  console.log(result);
  return (
    <div dangerouslySetInnerHTML={{ __html: diff.diff_prettyHtml(result) }} />
  );
}

export default DiffPassage;
