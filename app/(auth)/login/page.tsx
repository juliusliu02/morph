import React from "react";
import { LoginForm } from "@/components/form/login-form";
import type { Metadata } from "next";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Log in to your account",
};

export default async function Page() {
  const { user } = await getCurrentSession();
  if (user) {
    redirect("/app", RedirectType.replace);
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 mt-12">
      <LoginForm className="w-full max-w-sm"></LoginForm>
    </main>
  );
}
