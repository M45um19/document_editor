import type { Metadata } from "next";
import {
  Inter,
  Roboto,
  Outfit,
  Playfair_Display,
  Merriweather,
  Fira_Code,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
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
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${outfit.variable} ${playfair.variable} ${merriweather.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#f3f4f8] text-slate-800 font-sans flex flex-col">{children}</body>
    </html>
  );
}
