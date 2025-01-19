import React from "react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PassageCard from "@/components/passage-card";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await prisma.dialogue.findUnique({
    where: {
      id: id,
    },
    include: {
      versions: true,
    },
  });

  if (!result || !result.versions) {
    return redirect("/not_found");
  }

  const versions = result.versions.slice(result.versions.length - 2);

  return <PassageCard original={versions[0]} edit={versions[1]} />;
}

export default Page;
