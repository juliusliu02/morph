import { z } from "zod";
import { EditOptions } from "@/lib/types";

export const formSchema = z.object({
  title: z.string().trim().optional(),
  body: z.string().trim().min(1, { message: "PassageCard cannot be empty." }),
});

export const editFormSchema = z.object({
  original: z.string().trim(),
  editOption: z.enum(EditOptions),
});
