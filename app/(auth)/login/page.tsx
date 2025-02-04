import React from "react";
import { LoginForm } from "@/components/login-form";

function Page() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 mt-12">
      <LoginForm className="w-full max-w-sm"></LoginForm>
    </main>
  );
}

export default Page;
