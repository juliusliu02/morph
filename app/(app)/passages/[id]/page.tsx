import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Passage } from "@/components/passage";
import { LoadingSpinner } from "@/components/loading";
import { getCurrentSession } from "@/lib/auth/dal";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function Dialogue({ id }: { id: string }) {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/login");
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
    redirect("/error");
  }

  if (!passage || !passage.versions || passage.ownerId != user.id) {
    notFound();
  }
  return <Passage passage={passage} />;
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="p-5 flex w-full justify-center">
      <div className="mt-12 pt-5 flex flex-col items-center">
        <Suspense fallback={<LoadingSpinner className="fixed inset-[50%]" />}>
          <Dialogue id={id} />
        </Suspense>
      </div>
      <Toaster richColors />
    </main>
  );
}

export default Page;
