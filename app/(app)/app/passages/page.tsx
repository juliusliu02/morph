import React from "react";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import PassageList from "@/components/passage/passage-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Description, Title } from "@/components/typography";
import type { Metadata } from "next";
import { getPassages } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "My Passages",
};

async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    return redirect("/login");
  }

  const passages = await getPassages(user.id);

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-5rem)] pt-[5rem] px-5">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            <Title>My Passages</Title>
          </CardTitle>
          <CardDescription>
            <Description>
              {passages.length > 0
                ? "This is a list of your past passages."
                : "You don't currently have any passages."}
            </Description>
          </CardDescription>
        </CardHeader>
        {passages.length > 0 && (
          <CardContent>
            <PassageList passages={passages} />
          </CardContent>
        )}
      </Card>
    </main>
  );
}

export default Page;
