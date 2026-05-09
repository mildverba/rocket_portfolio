import { SectorAnalytics } from "@/components/dashboard/SectorAnalytics";
import { fetchPortfolioData } from "@/actions/sheets";

export const dynamic = "force-dynamic";

export default async function SectorAnalysisPage() {
  const { assets } = await fetchPortfolioData();
  const stocks = assets.filter(a => a.group !== "Crypto");
  const crypto = assets.filter(a => a.group === "Crypto");

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tighter">
            Sector <span className="text-purple-600">Intelligence</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            Detailed Industry Distribution analysis
          </p>
        </div>

        {/* Focused Sector Component */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <SectorAnalytics stocks={stocks} crypto={crypto} />
        </div>
      </div>
    </div>
  );
}
