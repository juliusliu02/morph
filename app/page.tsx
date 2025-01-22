import React from "react";
import { getCurrentSession } from "@/lib/auth/dal";
import { redirect } from "next/navigation";
import InputPassageForm from "@/components/input-passage-form";

async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  return <div className="flex flex-col items-center justify-center mt-20">
    <div className='w-full max-w-2xl'>
      <h2 className="pb-2 text-3xl font-semibold tracking-tight transition-colors">Hello {user.name}.</h2>
      <p className="text-xl text-muted-foreground">Input a passage to start editing.</p>
      <InputPassageForm />
    </div>
  </div>;
}

export default Page;
