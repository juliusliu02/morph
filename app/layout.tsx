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
        className={`${sourceSans3.className} antialiased bg-slate-50 dark:bg-slate-950 relative`}
      >
        <div
          className="absolute top-[10rem] -z-10 h-[28rem] rounded-full bg-[#DFE7F6] blur-[15rem]
                   right-[calc(46svw-20rem)] w-[20rem] sm:w-[26rem] dark:bg-[#10497E]"
        />
        <div
          className="absolute top-[6rem] -z-10 h-[24rem] w-[20rem] rounded-full bg-[#DDE5DC] blur-[15em]
                    left-[calc(48svw-18rem)] sm:w-[25rem] dark:bg-[#46AFA1]"
        />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
