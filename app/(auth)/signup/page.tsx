import React from "react";
import { SignupForm } from "@/components/form/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

const Page = () => (
  <main className="flex h-screen w-full items-center justify-center p-6 md:p-10">
    <SignupForm className="w-full max-w-sm"></SignupForm>
  </main>
);

export default Page;
