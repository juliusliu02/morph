import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Passage } from "@/components/passage";
import { getCurrentSession } from "@/lib/auth/dal";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { cache } from "react";

const fetchPassage = cache(async (id: string) => {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/login");
  }

  let passage;

  try {
    passage = await prisma.dialogue.findUnique({
      where: {
        id,
      },
      include: {
        versions: true,
      },
    });
  } catch (e) {
    console.error(e);
    redirect("/error");
  }

  if (!passage || !passage.versions || passage.ownerId != user.id) {
    notFound();
  }

  return passage;
});

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const passage = await fetchPassage(id);

  return (
    <div className="p-5 flex w-full justify-center">
      <div className="mt-12 pt-5">
        <Passage passage={passage} />
      </div>
      <Toaster richColors />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const passage = await fetchPassage(id);

  return {
    title: passage.title || "Untitled document",
  };
}

export default Page;
