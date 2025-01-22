import React from "react";
import { getCurrentSession } from "@/lib/auth/dal";
import { redirect } from "next/navigation";

async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  return <div>Hello {user.name}</div>;
}

export default Page;
