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
        className={`${sourceSans3.className} antialiased flex items-center justify-center bg-slate-50`}
      >
        <div className='max-w-screen-md'>
          {children}
        </div>
      </body>
    </html>
  );
}
