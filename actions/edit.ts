"use server";
import { getEdit } from "@/lib/llm";
import { idEditFormSchema, newDialogueSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/dal";
import { revalidatePath } from "next/cache";

type ActionState = {
  message: string;
};

export const createDialogue = async (
  _prevState: unknown,
  data: unknown,
): Promise<ActionState> => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in." };
  }

  // type guard
  if (!(data instanceof FormData)) {
    return { message: "Invalid form data." };
  }

  // validate data
  const formData = Object.fromEntries(data);
  const validatedFields = newDialogueSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { message: "Invalid input." };
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

  redirect(`/passages/${dialogue.id}`);
};

export const getEditById = async (
  id: unknown,
  edit: unknown,
): Promise<ActionState | void> => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in." };
  }

  // validate data
  const validatedFields = idEditFormSchema.safeParse({ id, edit });
  if (!validatedFields.success) {
    return { message: "Invalid input." };
  }

  const original = await prisma.version.findUnique({
    where: { id: validatedFields.data.id },
    include: {
      dialogue: true,
    },
  });

  if (!original) {
    return { message: "Passage not found." };
  }

  if (original.dialogue.ownerId !== user.id) {
    return { message: "Not authorized." };
  }

  // get edit
  const response = await getEdit(validatedFields.data.edit, original.text);
  if (!response.success) {
    return { message: response.error };
  }

  // store to database
  await prisma.dialogue.update({
    where: { id: original.dialogueId },
    data: {
      versions: {
        create: {
          edit: validatedFields.data.edit,
          text: response.response,
        },
      },
    },
  });

  revalidatePath(`/passages/${original.dialogueId}`);
};

export const deleteDialogue = async (
  id: unknown,
): Promise<ActionState | void> => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in." };
  }

  if (typeof id !== "string") {
    return { message: "Invalid input." };
  }

  let passage;
  try {
    passage = await prisma.dialogue.findUnique({
      where: { id: id },
    });
  } catch (error: unknown) {
    console.error(error);
    return { message: "Passage not found." };
  }

  if (!passage) {
    return { message: "Passage not found." };
  }

  if (passage.ownerId !== user.id) {
    return { message: "You are not authorized." };
  }

  try {
    await prisma.dialogue.delete({
      where: { id: passage.id },
    });
  } catch (error: unknown) {
    console.error(error);
    return { message: "server error, try again later" };
  }

  revalidatePath(`/passages/`);
};

export const changeTitle = async (
  id: unknown,
  title: unknown,
): Promise<ActionState | void> => {
  if (typeof id !== "string" || typeof title !== "string") {
    return { message: "Invalid input." };
  }
  const { user } = await getCurrentSession();

  if (!user) {
    return { message: "You are not logged in." };
  }

  let passage;

  try {
    passage = await prisma.dialogue.findUnique({
      where: {
        id: id,
      },
    });
  } catch (e) {
    console.error(e);
  }

  if (!passage || passage.ownerId != user.id) {
    return { message: "Passage doesn't exist." };
  }

  try {
    await prisma.dialogue.update({
      data: {
        title: title,
      },
      where: {
        id: id,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return { message: "Couldn't update title. Please try again later." };
  }
};
