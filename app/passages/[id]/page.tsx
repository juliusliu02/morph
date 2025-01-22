import React from "react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PassageCard from "@/components/passage-card";
import { getCurrentSession } from "@/lib/auth/dal";
import EditDropdown from "@/components/edit-dropdown";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/notfound");
  }

  let result;

  try {
    result = await prisma.dialogue.findUnique({
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

  if (!result || !result.versions) {
    return redirect("/notfound");
  }

  const versions = result.versions.slice(result.versions.length - 2);

  return <div className="p-5 flex items-center justify-center">
    <div className="w-full max-w-3xl ">
    <PassageCard original={versions[0]} edit={versions[1]} />
    <EditDropdown original={versions[1]} />
    </div>
  </div>;
}

export default Page;
