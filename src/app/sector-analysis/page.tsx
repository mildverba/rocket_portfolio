import { SectorAnalytics } from "@/components/dashboard/SectorAnalytics";
import { fetchPortfolioData } from "@/actions/sheets";

export const dynamic = "force-dynamic";

export default async function SectorAnalysisPage() {
  const { assets } = await fetchPortfolioData();
  const stocks = assets.filter(a => a.group !== "Crypto");

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
          <SectorAnalytics stocks={stocks} />
        </div>
        
        {/* Simple Data Check */}
        <div className="p-8 bg-slate-50/80 rounded-3xl border border-dashed border-slate-200">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
            Data Audit Path (Column D)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocks.map(asset => (
              <div key={asset.ticker} className="p-4 rounded-xl bg-white border border-slate-100 flex justify-between items-center shadow-sm">
                <span className="font-extrabold text-[#111827] text-xs">{asset.ticker}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">
                  {asset.sector || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
