"use server";
import { getCurrentSession } from "@/lib/auth/dal";
import { newDialogueSchema } from "@/lib/validations";
import { getEdit } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/actions/version";

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

  const decision = await rateLimit(user.id);
  if (decision.isDenied()) {
    return { message: "Too many requests. Please try again again." };
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

  const original = validatedFields.data.body;

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
            edit: "ORIGINAL",
            text: original,
          },
          {
            edit: "GRAMMAR",
            text: response.response.edit,
            feedback: response.response.feedback,
          },
        ],
      },
    },
  });

  redirect(`/app/passages/${dialogue.id}`);
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

  revalidatePath(`/app/passages/`);
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
