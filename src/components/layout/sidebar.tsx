"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, Wallet } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/40 h-screen flex flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Rocket Portfolio
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            pathname === "/" 
              ? "text-primary font-medium bg-primary/10" 
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link 
          href="/sector-analysis" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            pathname === "/sector-analysis" 
              ? "text-primary font-medium bg-primary/10" 
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          }`}
        >
          <PieChart className="w-4 h-4" />
          Analytics
        </Link>
      </nav>
      <div className="p-6 border-t mt-auto">
        <div className="text-sm text-muted-foreground">Currency: EUR</div>
      </div>
    </aside>
  );
}
