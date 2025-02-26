import React from "react";
import { getCurrentSession } from "@/lib/auth/dal";
import { redirect } from "next/navigation";
import InputPassageForm from "@/components/input-passage-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Subtitle, Title } from "@/components/typography";

async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] pt-[5rem]">
      <Card className="w-full max-w-2xl mx-5">
        <CardHeader>
          <CardTitle>
            <Title>
              Hello {user.name} {user.name.endsWith(".") ? null : "."}
            </Title>
          </CardTitle>
          <CardDescription>
            <Subtitle>Input a passage to start editing.</Subtitle>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputPassageForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
