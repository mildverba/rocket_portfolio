"use client";

import { Asset } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectorAllocation, TickerAllocation } from "./AllocationAnalysis";

interface Props {
  assets: Asset[];
}

export function SectorAllocationPage({ assets }: Props) {
  const stocks = assets.filter((a) => a.group !== "Crypto");
  const crypto = assets.filter((a) => a.group === "Crypto");
  const allAssets = [...stocks, ...crypto];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tighter">
            Portfolio <span className="text-purple-600">Analytics</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            Expected vs Actual allocation
          </p>
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
                value="tickers"
                className="text-[10px] md:text-sm font-extrabold px-4 md:px-6 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg transition-all tracking-tight"
              >
                По каждой акции
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sectors" className="m-0">
              <SectorAllocation allAssets={allAssets} />
            </TabsContent>

            <TabsContent value="tickers" className="m-0">
              <TickerAllocation allAssets={allAssets} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
