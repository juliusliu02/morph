"use server";
import "server-only";

import { grammarEdit, lexicalEdit } from "@/lib/prompts";
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

  // replace other line break characters.
  const result = await grammarEdit(
    validatedFields.data.body.replaceAll("\r\n", "\n").replaceAll("\r", "\n"),
  );

  if (!result.choices[0].message.content) {
    return { error: "Server error. Please alert the administrator." };
  }

  return {
    passagePair: {
      original: validatedFields.data.body,
      edit: result.choices[0].message.content,
    },
  };
};

export const getLexicalEdit = async (
  _prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const passage = data.get("body") as string;

  const result = await lexicalEdit(passage);
  if (!result.choices[0].message.content) {
    return { error: "Server error. Please alert the administrator." };
  }

  return {
    passagePair: {
      original: passage,
      edit: result.choices[0].message.content,
    },
  };
};
