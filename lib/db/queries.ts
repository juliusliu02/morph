import { cache } from "react";
import { prisma } from "@/lib/db/index";

export const getPassage = cache(async (id: string, userId: string) => {
  let passage;
  try {
    passage = await prisma.dialogue.findUnique({
      where: {
        id,
      },
      include: {
        versions: true,
      },
    });
  } catch (e) {
    console.error(e);
    return null;
  }

  if (!passage || passage.ownerId != userId) {
    return null;
  }

  return passage;
});

export const getPassages = cache(async (userId: string) => {
  const passages = await prisma.dialogue.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return passages;
});
