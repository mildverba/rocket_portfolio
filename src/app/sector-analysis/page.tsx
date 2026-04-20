import { PortfolioDashboard } from "@/components/dashboard/PortfolioDashboard";
import { fetchPortfolioData } from "@/actions/sheets";

export const dynamic = "force-dynamic";

export default async function SectorAnalysisPage() {
  const { assets, error, fetchTime } = await fetchPortfolioData();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tighter">
            Sector <span className="text-purple-600">Analytics</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            Deep dive into your portfolio concentration
          </p>
        </div>

        <PortfolioDashboard assets={assets} error={error} fetchTime={fetchTime} />
        
        <div className="mt-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black text-[#111827] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">01</span>
            Data Verification (Column D)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.filter(a => a.group !== "Crypto").map(asset => (
              <div key={asset.ticker} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="font-extrabold text-[#111827]">{asset.ticker}</span>
                <span className="text-[10px] font-bold px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-500 uppercase">
                  {asset.sector || "Empty (Col D)"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
