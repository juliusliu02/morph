"use client";
import React, { useEffect } from "react";
import { LoadingSpinner } from "@/components/loading";
import { demoLogin } from "@/actions/auth";

const Page = () => {
  useEffect(() => {
    demoLogin();
  });
  return (
    <div className={"w-full h-[100svh]"}>
      <LoadingSpinner className={"fixed inset-1/2"} />
    </div>
  );
};

export default Page;
