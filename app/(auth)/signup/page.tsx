import React from "react";
import { SignupForm } from "@/components/signup-form";

const Page = () => (
  <main className="flex h-screen w-full items-center justify-center p-6 md:p-10">
    <SignupForm className="w-full max-w-sm"></SignupForm>
  </main>
);

export default Page;
