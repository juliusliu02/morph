import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PassageCard from "@/components/passage-card";
import { getCurrentSession } from "@/lib/auth/dal";
import EditDropdown from "@/components/edit-dropdown";
import { Toaster } from "@/components/ui/toaster";
import { Subtitle, Title } from "@/components/typography";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/notfound");
  }

  let passage;

  try {
    passage = await prisma.dialogue.findUnique({
      where: {
        id: id,
      },
      include: {
        versions: true,
      },
    });
  } catch (e) {
    console.error(e);
  }

  if (!passage || !passage.versions || passage.ownerId != user.id) {
    notFound();
  }

  const versions = passage.versions.slice(passage.versions.length - 2);

  return (
    <main className="p-5 flex w-full justify-center">
      <div className="w-full max-w-3xl mt-10 pt-5">
        <div className="flex gap-5 items-baseline">
          <Title>{passage.title}</Title>
          <Subtitle className="text-gray-500">
            {passage.createdAt.toLocaleString("en-ca")}
          </Subtitle>
        </div>
        <PassageCard original={versions[0]} edit={versions[1]} />
        <EditDropdown original={versions[1]} />
      </div>
      <Toaster />
    </main>
  );
}

export default Page;
