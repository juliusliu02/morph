import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Passage from "@/components/passage";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="p-5 flex w-full justify-center">
      <div className="w-full max-w-3xl mt-10 pt-5">
        <Passage passageId={id} />
      </div>
      <Toaster />
    </main>
  );
}

export default Page;
