import React from "react";
import { getCurrentSession } from "@/lib/auth/dal";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PassageList from "@/components/passage-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    return redirect("/login");
  }

  const passages = await prisma.dialogue.findMany({
    where: {
      ownerId: user.id,
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <main className="flex justify-center items-center h-screen">
      <Card className="max-w-2xl w-full mx-5">
        <CardHeader>
          <CardTitle className="pb-2 text-3xl font-semibold tracking-tight transition-colors">
            Your passages
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground">
            This is a list of your past passages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PassageList passages={passages} />
        </CardContent>
      </Card>
    </main>
  );
}

export default Page;
