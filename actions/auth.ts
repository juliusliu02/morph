"use server";
import { signupFormSchema, loginFormSchema } from "@/lib/validations";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
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
import arcjet from "@/lib/auth/arcjet";
import { protectSignup } from "arcjet";
import { request } from "@arcjet/next";

type AuthFormState = {
  message: string;
};

const aj = arcjet.withRule(
  protectSignup({
    email: {
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block emails that are disposable, invalid, or have no MX records
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    },
    bots: {
      mode: "LIVE",
      // configured with a list of bots to allow from
      // https://arcjet.com/bot-list
      allow: [], // "allow none" will block all detected bots
    },
    // It would be unusual for a form to be submitted more than 5 times in 10
    // minutes from the same IP address
    rateLimit: {
      // uses a sliding window rate limit
      mode: "LIVE",
      interval: "10m", // counts requests over a 10 minute sliding window
      max: 5, // allows 5 submissions within the window
    },
  }),
);

export const signup = async (
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
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
      message: "Invalid form data.",
    };
  }

  const { name, username, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const req = await request();
  const decision = await aj.protect(req, {
    email,
    fingerprint: req.ip ?? "",
  });

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      return {
        message: "Invalid email address.",
      };
    } else {
      return {
        message: "Something went wrong. Please try again later.",
      };
    }
  }

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
    console.log(error);
    let errorMessage: string = "An error occurred while creating your account.";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // unique constraint
      console.table(error);
      if (error.code === "P2002" && typeof error.meta?.target === "string") {
        errorMessage = `The ${error.meta.target.split("_")[1]} is already taken.`;
      }
    }
    return { message: errorMessage };
  }

  redirect("/app", RedirectType.replace);
};

export const login = async (
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const validatedFields = loginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid input.",
    };
  }

  const { username, password } = validatedFields.data;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    return { message: "Network error. Please try again later." };
  }

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
  // might fail if the user has javascript disabled.
  await setSessionTokenCookie(token, session.expiresAt);

  redirect("/app", RedirectType.replace);
};

export const logout = async () => {
  const { session } = await getCurrentSession();
  if (session) {
    await invalidateSession(session.id);
  }

  await deleteSessionTokenCookie();
  redirect("/login", RedirectType.replace);
};
