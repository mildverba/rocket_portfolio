import Link from "next/link";
import { LayoutDashboard, PieChart, Wallet } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40 h-screen flex flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Rocket Portfolio
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-primary font-medium bg-primary/10 rounded-md">
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors">
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
