import { redirect, RedirectType } from "next/navigation";
import { createSession, generateSessionToken } from "@/lib/auth/service";
import { setSessionTokenCookie } from "@/lib/auth/cookie";

export async function GET() {
  const id = process.env.DEMO_ID;
  if (!id) {
    redirect("/error");
  }

  const token = generateSessionToken();

  const session = await createSession(token, id);
  await setSessionTokenCookie(token, session.expiresAt);

  redirect("/app", RedirectType.replace);
}
