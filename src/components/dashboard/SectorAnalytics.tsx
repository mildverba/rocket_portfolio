"use client";

import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Legend as ReLegend } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { Asset } from "@/lib/types";

const COLORS = ["#A855F7", "#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#3b82f6"];

interface SectorAnalyticsProps {
  stocks: Asset[];
}

export function SectorAnalytics({ stocks }: SectorAnalyticsProps) {
  const stocksTotal = stocks.reduce((acc, curr) => acc + (curr.shares * curr.currentPrice), 0);

  // Sector Stats calculation
  const sectorStats: Record<string, number> = {};
  stocks.forEach(asset => {
    const s = asset.sector?.trim() || "Other";
    const value = (asset.shares || 0) * (asset.currentPrice || 0);
    if (!isNaN(value) && value > 0) {
      sectorStats[s] = (sectorStats[s] || 0) + value;
    }
  });

  const sectorData = Object.entries(sectorStats)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ 
      name, 
      value,
      percent: stocksTotal > 0 ? (value / stocksTotal) * 100 : 0
    }));

  const hasSectorData = sectorData.length > 0;

  if (!hasSectorData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <PieIcon size={32} className="text-slate-200" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">No Sector Data Available</h3>
        <p className="text-slate-400 text-sm font-bold text-center mt-2 max-w-[300px]">
          Please ensure Column D in your Google Sheet is populated with sector information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
         <div>
            <h2 className="text-xl md:text-2xl font-black text-purple-900 tracking-tighter">Sector Intelligence</h2>
            <p className="text-sm text-purple-600 font-extrabold uppercase tracking-widest opacity-80 mt-1">
              Analyzing {stocks.length} assets across {sectorData.length} industries
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 border-2 border-purple-100/50 rounded-3xl p-6 md:p-8 bg-white shadow-sm">
        {/* Left Column: Pie Chart Visualization */}
        <div className="bg-slate-50/50 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Sector Allocation Map</h3>
          <div className="w-full h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie 
                  data={sectorData} 
                  innerRadius={80} 
                  outerRadius={120} 
                  dataKey="value" 
                  paddingAngle={5}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {sectorData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReLegend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  content={(props: any) => {
                    const { payload } = props;
                    return (
                      <ul className="text-xs font-bold text-slate-500 space-y-3 ml-4">
                        {payload.map((entry: any, index: number) => (
                          <li key={`index-${index}`} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-[#111827]">{entry.value}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Detailed List */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Detailed Breakdown</h3>
          <div className="space-y-4">
            {sectorData.map((data, index) => (
              <div key={data.name} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-extrabold text-[#111827] text-sm md:text-base group-hover:text-purple-600 transition-colors uppercase tracking-tight">{data.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-[#111827] tracking-tighter">{data.percent.toFixed(1)}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">€{data.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <div 
                    className="h-full rounded-full transition-all ease-out" 
                    style={{ 
                      width: `${data.percent}%`, 
                      backgroundColor: COLORS[index % COLORS.length],
                      boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}40`
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
