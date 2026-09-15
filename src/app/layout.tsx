import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Document Editor (PoC)",
  description: "An interactive visual document editor and template management system built with Next.js (App Router).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[#f3f4f8] text-slate-800 font-sans flex flex-col">{children}</body>
    </html>
  );
}
