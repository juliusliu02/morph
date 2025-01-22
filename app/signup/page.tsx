import React from "react";
import { SignupForm } from "@/components/signup-form";

function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <SignupForm className="w-full max-w-lg"></SignupForm>
    </div>
  );
}

export default Page;
