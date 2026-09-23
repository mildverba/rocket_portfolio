"use client";

import { useEffect, useState } from "react";
import { Asset } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorAllocation, CryptoAllocation, AllocationRationale } from "./AllocationAnalysis";
import { RefreshCw } from "lucide-react";

interface Props {
  assets: Asset[];
}

export function SectorAllocationPage({ assets: initialAssets }: Props) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitize = (raw: any[]): Asset[] =>
    raw.map((a) => ({
      ...a,
      shares: typeof a.shares === "number" && isFinite(a.shares) ? a.shares : 0,
      avgPrice: typeof a.avgPrice === "number" && isFinite(a.avgPrice) ? a.avgPrice : 0,
      currentPrice: typeof a.currentPrice === "number" && isFinite(a.currentPrice) ? a.currentPrice : 0,
      portfolioPercent: typeof a.portfolioPercent === "number" && isFinite(a.portfolioPercent) ? a.portfolioPercent : 0,
    }));

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assets: initialAssets }),
        });
        if (!res.ok) return;
        const { updatedAssets } = await res.json();
        if (updatedAssets) setAssets(sanitize(updatedAssets));
      } catch {
        // fall back to sheet data
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stocks = assets.filter((a) => a.group !== "Crypto");
  const crypto = assets.filter((a) => a.group === "Crypto");
  const allAssets = [...stocks, ...crypto];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tighter">
              Portfolio <span className="text-purple-600">Analytics</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
              Expected vs Actual allocation
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Загрузка цен...
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
          <Tabs defaultValue="sectors" className="flex flex-col gap-6">
            <TabsList className="bg-slate-100/80 p-1 h-10 md:h-11 rounded-xl w-fit">
              <TabsTrigger
                value="sectors"
                className="text-[10px] md:text-sm font-extrabold px-4 md:px-6 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg transition-all tracking-tight"
              >
                Сектора портфеля
              </TabsTrigger>
              <TabsTrigger
                value="crypto"
                className="text-[10px] md:text-sm font-extrabold px-4 md:px-6 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg transition-all tracking-tight"
              >
                Крипто
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sectors" className="m-0">
              <SectorAllocation allAssets={allAssets} loading={loading} />
            </TabsContent>

            <TabsContent value="crypto" className="m-0">
              <CryptoAllocation allAssets={allAssets} loading={loading} />
            </TabsContent>
          </Tabs>
        </div>

        <AllocationRationale />
      </div>
    </div>
  );
}
