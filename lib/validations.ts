import { z } from "zod";

export const formSchema = z.object({
  title: z.string().trim().optional(),
  body: z.string().trim().min(1, { message: "PassageCard cannot be empty." }),
});
