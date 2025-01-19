"use server";
import "server-only";
import { getEdit } from "@/lib/prompts";
import { formSchema, textEditFormSchema } from "@/lib/validations";
import { PassagePair } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

type ActionState = {
  message: string;
};

export const createDialogue = async (
  _prevState: unknown,
  data: unknown,
): Promise<ActionState> => {
  // type guard
  if (!(data instanceof FormData)) {
    return { message: "invalid form data" };
  }
  // validate data
  const formData = Object.fromEntries(data);
  const validatedFields = formSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { message: "invalid input" };
  }
  // format line breaks
  const original = validatedFields.data.body
    .replaceAll("\r\n", "\n")
    .replaceAll("\n", " ");
  // get edit
  const response = await getEdit("GRAMMAR", original);
  if (!response.success) {
    return { message: response.error };
  }
  // store to database
  const dialogue = await prisma.dialogue.create({
    data: {
      title: validatedFields.data.title,
      versions: {
        create: [
          {
            text: original,
            edit: "ORIGINAL",
          },
          {
            text: response.response,
            edit: "GRAMMAR",
          },
        ],
      },
    },
  });

  redirect(`/${dialogue.id}`);
};

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

  const result = await getEdit("GRAMMAR", original);

  if (!result.success) {
    return { error: result.error };
  }

  await prisma.dialogue.create({
    data: {
      versions: {
        create: [
          {
            text: original,
            edit: "ORIGINAL",
          },
          {
            text: result.response,
            edit: "GRAMMAR",
          },
        ],
      },
    },
  });

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
  const result = await getEdit("LEXICAL", passage);

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
