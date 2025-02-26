"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

export const NavigationBackArrow: React.FC<{ className?: string }> = ({
  className,
}) => {
  const router = useRouter();
  return (
    <ArrowLeft
      className={cn(className, "cursor-pointer")}
      onClick={router.back}
    />
  );
};
