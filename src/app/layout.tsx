import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { LayoutDashboard, PieChart, Wallet } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Rocket Portfolio",
  description: "Advanced Portfolio Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen bg-background text-foreground flex-col md:flex-row`}
      >
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-[60]">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded-lg">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-black tracking-tighter">Rocket Portfolio</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/">
              <LayoutDashboard className="w-5 h-5 text-slate-500 hover:text-purple-600 transition-colors" />
            </Link>
            <Link href="/sector-analysis">
              <PieChart className="w-5 h-5 text-slate-500 hover:text-purple-600 transition-colors" />
            </Link>
          </nav>
        </header>

        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
