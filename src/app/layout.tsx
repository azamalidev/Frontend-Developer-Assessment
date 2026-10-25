import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fomi — AI Content Generation Workspace",
  description:
    "Fomi is an AI-powered platform for image and video generation. This is the frontend technical assessment — Part A mockup recreation + Part B original Composer workspace.",
  keywords: [
    "Fomi",
    "AI image generation",
    "Next.js",
    "Tailwind CSS",
    "frontend assessment",
  ],
  authors: [{ name: "Fomi Frontend Assessment" }],
  openGraph: {
    title: "Fomi — AI Content Generation Workspace",
    description:
      "A faithful mockup recreation (Part A) plus an original cinematic-dark Composer workspace (Part B) for image generation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
