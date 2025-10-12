import { LoadingSpinner } from "@/components/loading";
import React from "react";

export default function Loading() {
  return (
    <div className="h-[100svh] w-full">
      <LoadingSpinner className="fixed inset-1/2" />
    </div>
  );
}
