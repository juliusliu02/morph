import React from "react";
import Intro from "@/components/landing/intro";

function Page() {
  return (
    <div className="pt-32 flex justify-center">
      <main className="max-w-3xl flex flex-col items-center px-10 sm:px-20">
        <Intro />
      </main>
    </div>
  );
}

export default Page;
