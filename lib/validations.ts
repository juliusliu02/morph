import { z } from "zod";
import { Edit } from "@prisma/client";

export const formSchema = z.object({
  title: z.string().trim().optional(),
  body: z.string().trim().min(1, { message: "PassageCard cannot be empty." }),
});

export const textEditFormSchema = z.object({
  original: z.string().trim().min(1, { message: "Text cannot be empty." }),
  edit: z.nativeEnum(Edit),
});

export const idEditFormSchema = z.object({
  original: z.string().min(1),
  edit: z.nativeEnum(Edit),
});
