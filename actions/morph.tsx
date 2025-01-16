"use server";
import "server-only";

import { getEdit } from "@/lib/prompts";
import { formSchema } from "@/lib/validations";
import { PassagePair } from "@/lib/types";

type FormState =
  | {
      passagePair: PassagePair;
      error?: never;
    }
  | {
      passagePair?: never;
      error: string;
    }
  | null;

export const getGrammarEdit = async (
  _prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const formData = Object.fromEntries(data);
  const validatedFields = formSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  // TODO: remove the last part when paragraph parsing is set up
  const original = validatedFields.data.body
    .replaceAll("\r\n", "\n")
    .replaceAll("\n", " ");

  const result = await getEdit("grammar", original);

  if (result.error) {
    return { error: result.error };
  }

  return {
    passagePair: {
      original: original,
      edit: result.response!,
    },
  };
};

export const getLexicalEdit = async (
  _prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const passage = data.get("body") as string;
  const result = await getEdit("lexical", passage);

  if (result.error) {
    return { error: result.error };
  }

  return {
    passagePair: {
      original: passage,
      edit: result.response!,
    },
  };
};
