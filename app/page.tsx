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

async function Page() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="pb-2 text-3xl font-semibold tracking-tight transition-colors">
            Hello {user.name}.
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground">
            Input a passage to start editing.
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
