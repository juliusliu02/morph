import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { PassageBody, PassageTitle } from "@/components/passage";
import { NavigationBackArrow } from "@/components/navigation";
import { getDialogue } from "@/actions/edit";
import { Subtitle } from "@/components/typography";
import EditDropdown from "@/components/edit-dropdown";
import { LoadingSpinner } from "@/components/loading";

type PassageProps = {
  passageId: string;
};

async function Passage({ passageId }: PassageProps) {
  const passage = await getDialogue(passageId);
  return (
    <>
      <div className="flex justify-between">
        <span className="flex gap-5 items-baseline">
          <PassageTitle passage={passage} />
          <Subtitle className="text-slate-500">
            {passage!.createdAt.toLocaleString("en-ca")}
          </Subtitle>
        </span>
        <EditDropdown
          original={passage!.versions[passage!.versions.length - 1]}
        />
      </div>
      <PassageBody
        original={passage!.versions[passage!.versions.length - 2]}
        edit={passage!.versions[passage!.versions.length - 1]}
      />
    </>
  );
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-5 flex w-full justify-center">
      <div className="w-full max-w-3xl mt-10 pt-5">
        <NavigationBackArrow className="mb-5" />
        <Suspense fallback={<LoadingSpinner className="fixed inset-[50%]" />}>
          <Passage passageId={id} />
        </Suspense>
      </div>
      <Toaster richColors />
    </main>
  );
}

export default Page;
