"use server";
import "server-only";
import { signupFormSchema, loginFormSchema } from "@/lib/validations";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { redirect, RedirectType } from "next/navigation";
import {
  createSession,
  generateSessionToken,
  invalidateSession,
} from "@/lib/auth/auth";
import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
} from "@/lib/auth/cookie";
import { getCurrentSession } from "@/lib/auth/dal";
import { Prisma } from "@prisma/client";

type AuthFormState = {
  message: string;
};

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  // Validate form fields
  const validatedFields = signupFormSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      // errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data",
    };
  }

  const { name, username, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        hashedPassword,
      },
    });

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    await setSessionTokenCookie(token, session.expiresAt);
  } catch (error: unknown) {
    let errorMessage: string = "An error occurred while creating your account.";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // unique constraint
      if (error.code === "P2002") {
        errorMessage = `The ${(error.meta?.target as string).split("_")[1]} is already taken.`;
      }
    }
    return { message: errorMessage };
  }

  redirect("/", RedirectType.replace);
}

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = loginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "invalid input",
    };
  }

  const { username, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return {
      message: "Invalid login.",
    };
  }

  const verify = await bcrypt.compare(password, user.hashedPassword);

  if (!verify) {
    return {
      message: "Invalid login.",
    };
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  // might fail.
  /// TODO: add try catch block, if error occurs, return the token and set token on client side if that works.
  await setSessionTokenCookie(token, session.expiresAt);

  redirect("/", RedirectType.replace);
}

export async function logout() {
  const { session } = await getCurrentSession();
  if (session) {
    await invalidateSession(session.id);
  }

  await deleteSessionTokenCookie();
  redirect("/", RedirectType.replace);
}
