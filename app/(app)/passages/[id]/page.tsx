import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Passage } from "@/components/passage";
import { NavigationBackArrow } from "@/components/navigation";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-5 flex w-full justify-center">
      <div className="w-sm sm:w-full sm:max-w-3xl mt-10 pt-5">
        <NavigationBackArrow className="mb-5" />
        <Passage passageId={id} />
      </div>
      <Toaster richColors />
    </main>
  );
}

export default Page;
