import { z } from "zod";
import { Edit } from "@prisma/client";

export const newDialogueSchema = z.object({
  title: z.string().trim(),
  body: z
    .string()
    .trim()
    .min(200, { message: "The passage must be longer than 200 characters." }),
});

export const textEditFormSchema = z.object({
  original: z.string().trim().min(1, { message: "Text cannot be empty." }),
  edit: z.nativeEnum(Edit),
});

export const presetEditSchema = z.object({
  id: z.string(),
  edit: z.enum([Edit.GRAMMAR, Edit.LEXICAL, Edit.LOGICAL]),
});

export const customEditSchema = z.object({
  id: z.string(),
  prompt: z.string().trim(),
});

export const selfEditSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .trim()
    .min(200, { message: "The passage must be longer than 200 characters." }),
});

export const loginFormSchema = z.object({
  username: z.string().trim().nonempty(),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be longer than 8 characters" }),
});

export const signupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .max(30, { message: "Username must be at most 30 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .trim(),
});
