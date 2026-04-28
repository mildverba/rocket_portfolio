"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, PieChart, Wallet, LogOut, LineChart } from "lucide-react";

export function MobileNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b bg-white/95 backdrop-blur-md sticky top-0 z-[60] shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-purple-600 p-1.5 rounded-lg shadow-lg shadow-purple-200">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        <span className="font-black tracking-tighter text-slate-900">Rocket Portfolio</span>
      </div>
      <nav className="flex gap-5 items-center">
        <Link href="/">
          <LayoutDashboard className="w-5 h-5 text-slate-500 hover:text-purple-600 transition-colors" />
        </Link>
        <Link href="/sector-analysis">
          <PieChart className="w-5 h-5 text-slate-500 hover:text-purple-600 transition-colors" />
        </Link>
        <Link href="/charts">
          <LineChart className="w-5 h-5 text-slate-500 hover:text-purple-600 transition-colors" />
        </Link>
        <button onClick={handleLogout} className="text-rose-500 hover:text-rose-700 transition-all active:scale-90">
          <LogOut className="w-5 h-5" />
        </button>
      </nav>
    </header>
  );
}
