"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, PieChart, Wallet, LineChart } from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

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
        <Link 
          href="/charts" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors pl-7 ${
            pathname === "/charts" 
              ? "text-primary font-medium bg-primary/10" 
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          }`}
        >
          <LineChart className="w-4 h-4" />
          Charts
        </Link>
      </nav>
      <div className="p-6 border-t mt-auto space-y-4">
        <div className="text-sm text-muted-foreground font-bold opacity-70">Currency: EUR</div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-md transition-all group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
