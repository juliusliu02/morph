import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Passage } from "@/components/passage";
import type { Metadata } from "next";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { getPassage } from "@/lib/db/queries";

const preload = (id: string) => {
  void getPassage(id);
};

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  preload(id);

  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  const passage = await getPassage(id);
  if (!passage || passage.ownerId != user.id) {
    notFound();
  }

  return (
    <div className="px-4 flex w-full justify-center">
      <div className="mt-20">
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
  const { id } = await params;
  preload(id);

  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  const passage = await getPassage(id);
  if (!passage || passage.ownerId != user.id) {
    notFound();
  }

  return {
    title: passage.title || "Untitled document",
  };
}

export default Page;
