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
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
