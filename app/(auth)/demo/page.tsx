"use client";
import React, { useEffect } from "react";
import { LoadingSpinner } from "@/components/loading";
import { demoLogin } from "@/actions/auth";

const Page = () => {
  useEffect(() => {
    demoLogin();
  });
  return (
    <div className={"w-full h-[100svh] flex items-center justify-center"}>
      <LoadingSpinner />
    </div>
  );
};

export default Page;
