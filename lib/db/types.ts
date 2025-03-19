import type { Prisma } from "@prisma/client";

export type DialogueWithVersion = Prisma.DialogueGetPayload<{
  include: {
    versions: true;
  };
}>;
