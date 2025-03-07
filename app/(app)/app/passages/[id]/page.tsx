import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Passage } from "@/components/passage";
import type { Metadata } from "next";
import { getCurrentSession } from "@/lib/auth/dal";
import { notFound, redirect } from "next/navigation";
import { getPassage } from "@/lib/db/queries";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  const passage = await getPassage(id, user.id);
  if (!passage) {
    notFound();
  }

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
  const { id } = await params;
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  const passage = await getPassage(id, user.id);
  if (!passage) {
    notFound();
  }

  return {
    title: passage.title || "Untitled document",
  };
}

export default Page;
