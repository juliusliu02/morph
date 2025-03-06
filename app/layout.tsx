import type { Metadata } from "next";
import "./globals.css";
import { Source_Sans_3 } from "next/font/google";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    template: "%s | Morph",
    default: "Smart AI Editor | Morph",
  },
};

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans3.className} antialiased bg-gray-50 dark:bg-slate-950 relative`}
      >
        <div
          className="absolute left-[38svw] top-[8rem] -z-10 h-[32rem] w-[15rem] rounded-full bg-[#DFE7F6] blur-[10rem]
                   sm:w-[25rem] dark:bg-[#10497E]"
        />
        <div
          className="absolute right-[36svw] top-[4rem] -z-10 h-[24rem] w-[20rem] rounded-full bg-[#DDE5DC] blur-[10em]
                    sm:w-[28rem] dark:bg-[#46AFA1]"
        />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
