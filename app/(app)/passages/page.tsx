import React, { Suspense } from "react";
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
import { Subtitle, Title } from "@/components/typography";
import { LoadingSpinner } from "@/components/loading";
import { CenteredContainer } from "@/components/container";

async function PassageListCard() {
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
    <main className="flex justify-center items-center min-h-[calc(100vh-5rem)] pt-[5rem]">
      <Card className="max-w-2xl w-full mx-5">
        <CardHeader>
          <CardTitle>
            <Title>Your passages</Title>
          </CardTitle>
          <CardDescription>
            <Subtitle>
              {passages.length > 0
                ? "This is a list of your past passages."
                : "You currently don't have any passages."}
            </Subtitle>
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

async function Page() {
  return (
    <Suspense
      fallback={
        <CenteredContainer>
          <LoadingSpinner />
        </CenteredContainer>
      }
    >
      <PassageListCard />
    </Suspense>
  );
}

export default Page;
