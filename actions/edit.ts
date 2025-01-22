"use server";
import "server-only";
import { getEdit } from "@/lib/llm";
import { newDialogueSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/dal";

type ActionState = {
  message: string;
};

export const createDialogue = async (
  _prevState: unknown,
  data: unknown,
): Promise<ActionState> => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in" };
  }

  // type guard
  if (!(data instanceof FormData)) {
    return { message: "invalid form data" };
  }

  // validate data
  const formData = Object.fromEntries(data);
  const validatedFields = newDialogueSchema.safeParse(formData);
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
      ownerId: user.id,
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
