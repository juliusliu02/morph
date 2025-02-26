import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Passage } from "@/components/passage";
import { NavigationBackArrow } from "@/components/navigation";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-5 flex w-full justify-center">
      <div className="mt-10 pt-5 flex flex-col items-center">
        <Passage passageId={id} />
      </div>
      <Toaster richColors />
    </main>
  );
}

export default Page;
