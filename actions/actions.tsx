"use server";
import "server-only";
import { getEdit } from "@/lib/llm";
import { formSchema, idEditFormSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
  const original = validatedFields.data.body.replaceAll("\r\n", "\n");
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
