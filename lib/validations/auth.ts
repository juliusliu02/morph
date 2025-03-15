import { z } from "zod";

export const loginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .nonempty({ message: "Username cannot be empty." })
    .transform((text) => text.toLowerCase()),
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
    .trim()
    .transform((text) => text.toLowerCase()),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be longer than 8 characters." })
    .trim(),
});
