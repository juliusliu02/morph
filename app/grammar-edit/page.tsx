"use client";
import React, { useActionState } from "react";
import { getLexicalEdit } from "@/actions/morph";
import { Button } from "@/components/ui/button";
import PassageCard from "@/components/passage-card";
import { PassagePair } from "@/lib/types";

function Page({ pair }: { pair: PassagePair }) {
  const [state, formAction, isPending] = useActionState(getLexicalEdit, null);

  return (
    <div>
      {state?.passagePair && (
        <>
          <p className="border-b pb-2 text-3xl font-semibold tracking-tight">
            Lexical edit
          </p>
          <PassageCard pair={state.passagePair} />
        </>
      )}
      <p className="border-b pb-2 text-3xl font-semibold tracking-tight">
        Grammar edit
      </p>
      <PassageCard pair={pair} />
      <></>
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
