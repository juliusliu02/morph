import { z } from "zod";
import { Edit } from "@prisma/client";

export const newDialogueSchema = z.object({
  title: z.string().trim(),
  body: z
    .string()
    .trim()
    .min(200, { message: "Passage must be longer than 200 characters." })
    .transform((text) => text.replaceAll("\r\n", "\n")),
});

export const presetEditSchema = z.object({
  id: z.string(),
  edit: z.enum([Edit.GRAMMAR, Edit.LEXICAL, Edit.LOGICAL]),
});

export const customEditSchema = z.object({
  id: z.string(),
  prompt: z.string().trim().nonempty("Please enter a valid prompt."),
});

export const selfEditSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .trim()
    .min(200, { message: "The passage must be longer than 200 characters." })
    .transform((text) => text.replaceAll("\r\n", "\n")),
});

export const loginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .nonempty({ message: "Username cannot be empty." }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be longer than 8 characters." }),
});

export const signupFormSchema = z.object({
  name: z.string().nonempty({ message: "Name cannot be empty." }).trim(),
  username: z
    .string()
    .min(2, { message: "Username must be longer than 2 characters." })
    .max(30, { message: "Username must be longer than 30 characters." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be longer than 8 characters." })
    .trim(),
});
