"use server";
import { getEdit } from "@/lib/llm";
import {
  presetEditSchema,
  customEditSchema,
  selfEditSchema,
} from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/dal";
import { revalidatePath } from "next/cache";

type ActionState = {
  message: string;
};

export const getPresetEdit = async (
  id: unknown,
  edit: unknown,
): Promise<ActionState | void> => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in." };
  }

  // validate data
  const validatedFields = presetEditSchema.safeParse({ id, edit });
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

export const getCustomEdit = async (id: unknown, prompt: unknown) => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in." };
  }

  const validatedFields = customEditSchema.safeParse({ id, prompt });
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

  const response = await getEdit(
    "CUSTOM",
    original.text,
    validatedFields.data.prompt,
  );
  if (!response.success) {
    return { message: response.error };
  }

  await prisma.dialogue.update({
    where: { id: original.dialogueId },
    data: {
      versions: {
        create: {
          edit: "CUSTOM",
          text: response.response,
        },
      },
    },
  });

  revalidatePath(`/passages/${original.dialogueId}`);
};

export const saveSelfEdit = async (
  id: unknown,
  text: unknown,
): Promise<ActionState | void> => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in." };
  }

  const validatedFields = selfEditSchema.safeParse({ id, text });
  if (!validatedFields.success) {
    return {
      message: "Invalid input.",
    };
  }

  const version = await prisma.version.findUnique({
    where: { id: validatedFields.data.id },
    include: {
      dialogue: true,
    },
  });

  if (!version) {
    return { message: "Passage not found." };
  }

  if (version.dialogue.ownerId !== user.id) {
    return { message: "Not authorized." };
  }

  if (version.text === validatedFields.data.text) {
    return;
  }

  const formattedText = validatedFields.data.text.replaceAll("\r\n", "\n");

  // store to database
  await prisma.dialogue.update({
    where: { id: version.dialogueId },
    data: {
      versions: {
        create: {
          edit: "SELF",
          text: formattedText,
        },
      },
    },
  });

  revalidatePath(`/passages/${version.dialogueId}`);
};
