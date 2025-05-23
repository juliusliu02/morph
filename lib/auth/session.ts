import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import {
  type SessionValidationResult,
  validateSessionToken,
} from "@/lib/auth/service";

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    return await validateSessionToken(token);
  },
);
