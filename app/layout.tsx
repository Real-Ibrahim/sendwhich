import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SendWhich — VoltRoom",
  description:
    "Create temporary collaboration rooms with P2P file sharing and privacy-first design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=BBH+Bogle&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Image
            src="/bg.png"
            alt="Cosmic Nebula Background"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-indigo-950/20 to-purple-950/40" />
        </div>

        {/* Foreground content */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
