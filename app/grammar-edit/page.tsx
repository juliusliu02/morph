"use client";
import React, { useActionState } from "react";
import { getLexicalEdit } from "@/actions/morph";
import { Button } from "@/components/ui/button";
import DiffPassage from "@/components/diff-passage";
import { PassagePair } from "@/lib/types";

function Page({ pair }: { pair: PassagePair }) {
  const [state, formAction, isPending] = useActionState(getLexicalEdit, null);

  return (
    <div>
      {state?.passagePair && <DiffPassage pair={state.passagePair} />}
      <DiffPassage pair={pair} />
      <form action={formAction}>
        <input hidden name="body" readOnly value={pair.edit} />
        <Button
          type="submit"
          disabled={isPending || state?.passagePair !== undefined}
        >
          Get lexical edit
        </Button>
      </form>
    </div>
  );
}

export default Page;
