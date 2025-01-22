import type { Metadata } from "next";
import "./globals.css";
import { Source_Sans_3 } from "next/font/google";
import React from "react";

export const metadata: Metadata = {
  title: "Morph",
  description: "AI-powered multi-step essay editor",
};

const sourceSans3 = Source_Sans_3();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans3.className} antialiased bg-slate-50`}
      >
          {children}
      </body>
    </html>
  );
}
