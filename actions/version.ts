"use server";
import { getEdit } from "@/lib/llm";
import {
  customEditSchema,
  presetEditSchema,
  selfEditSchema,
} from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/dal";
import { revalidatePath } from "next/cache";
import arcjet from "@/lib/arcjet";
import { tokenBucket } from "arcjet";
import { request } from "@arcjet/next";

type ActionState = {
  message: string;
};

const aj = arcjet.withRule(
  tokenBucket({
    mode: "LIVE",
    refillRate: 5,
    interval: 60 * 15,
    capacity: 20,
  }),
);

const rateLimit = async (id: string) => {
  const req = await request();
  return aj.protect(req, {
    fingerprint: id,
    requested: 5,
  });
};

export const getPresetEdit = async (
  id: unknown,
  edit: unknown,
): Promise<ActionState | void> => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in." };
  }

  const decision = await rateLimit(user.id);
  if (decision.isDenied()) {
    return { message: "Too many requests. Please try again again." };
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
          text: response.response.edit,
          feedback: response.response.feedback,
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

  const decision = await rateLimit(user.id);
  if (decision.isDenied()) {
    return { message: "Too many requests. Please try again again." };
  }

  const validatedFields = customEditSchema.safeParse({ id, prompt });
  if (!validatedFields.success) {
    return { message: "Invalid input." };
  }

  let original;
  try {
    original = await prisma.version.findUniqueOrThrow({
      where: { id: validatedFields.data.id },
      include: {
        dialogue: true,
      },
    });
  } catch (error: unknown) {
    console.error(error);
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
          text: response.response.edit,
          feedback: response.response.feedback,
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

  let version;
  try {
    version = await prisma.version.findUniqueOrThrow({
      where: { id: validatedFields.data.id },
      include: {
        dialogue: true,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return { message: "Passage not found." };
  }
  if (version.dialogue.ownerId !== user.id) {
    return { message: "Not authorized." };
  }

  if (version.text === validatedFields.data.text) {
    return;
  }

  // store to database
  await prisma.dialogue.update({
    where: { id: version.dialogueId },
    data: {
      versions: {
        create: {
          edit: "SELF",
          text: validatedFields.data.text,
        },
      },
    },
  });

  revalidatePath(`/passages/${version.dialogueId}`);
};

export const deleteEdit = async (id: unknown): Promise<ActionState | void> => {
  const { user } = await getCurrentSession();
  if (!user) {
    return { message: "Not logged in." };
  }

  if (typeof id !== "string") {
    return { message: "Invalid input." };
  }

  let version;
  try {
    version = await prisma.version.findUniqueOrThrow({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    return { message: "Edit not found." };
  }

  try {
    const dialogue = await prisma.dialogue.findUniqueOrThrow({
      where: { id: version.dialogueId },
      include: {
        _count: {
          select: {
            versions: true,
          },
        },
      },
    });

    if (dialogue._count.versions > 2) {
      await prisma.version.delete({
        where: { id },
      });
    } else {
      return {
        message:
          "This is the only edit of the passage. To revert this edit, delete the whole passage instead.",
      };
    }
  } catch (error) {
    console.error(error);
    return { message: "Server error. Please alert the administrator." };
  }

  revalidatePath(`/passages/${version.dialogueId}`);
};
