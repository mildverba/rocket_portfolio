/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Legend as ReLegend } from "recharts";
import { PieChart as PieIcon, BarChart3 } from "lucide-react";
import { Asset } from "@/lib/types";

const COLORS = ["#A855F7", "#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#3b82f6"];

interface SectorAnalyticsProps {
  stocks: Asset[];
  crypto?: Asset[];
}

const getValue = (asset: Asset) => {
  const price = asset.currentPrice > 0 ? asset.currentPrice : asset.avgPrice;
  return (asset.shares || 0) * (price || 0);
};

function DistributionView({ 
  assets, 
  title, 
  accentColor = "blue",
  typeLabel = "Asset"
}: { 
  assets: Asset[], 
  title: string, 
  accentColor?: "blue" | "purple" | "orange",
  typeLabel?: string
}) {
  const total = assets.reduce((acc, curr) => acc + getValue(curr), 0);
  
  // Sector Stats calculation
  const sectorStats: Record<string, number> = {};
  assets.forEach(asset => {
    const s = asset.sector?.trim() || "Other";
    const value = getValue(asset);
    if (!isNaN(value) && value > 0) {
      sectorStats[s] = (sectorStats[s] || 0) + value;
    }
  });

  const sectorData = Object.entries(sectorStats)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ 
      name, 
      value,
      percent: total > 0 ? (value / total) * 100 : 0
    }));

  // Individual Asset Stats calculation
  const assetData = assets
    .map(asset => {
      const val = getValue(asset);
      return {
        ticker: asset.ticker,
        value: val,
        percent: total > 0 ? (val / total) * 100 : 0
      };
    })
    .sort((a, b) => b.value - a.value);

  const colorsMap = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", bar: "bg-blue-500", hover: "group-hover:text-blue-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", bar: "bg-purple-500", hover: "group-hover:text-purple-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", bar: "bg-orange-500", hover: "group-hover:text-orange-600" },
  };

  const currentTheme = colorsMap[accentColor];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className={`${currentTheme.bg} p-2 rounded-lg`}>
          <BarChart3 className={`w-5 h-5 ${currentTheme.text}`} />
        </div>
        <h2 className="text-xl font-black text-[#111827] tracking-tight uppercase tracking-tighter">{title}</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* SECTION 1: ASSET PERCENTAGES */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-[10px] md:text-xs font-black text-slate-400 tracking-widest uppercase">Percentage by {typeLabel}</h3>
          </div>
          
          <div className="bg-white border-2 border-slate-50 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {assetData.map((data, index) => (
              <div key={data.ticker} className="group relative">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-slate-300 transition-colors border border-slate-100 rounded-md">
                      {index + 1}
                    </span>
                    <span className={`font-extrabold text-[#111827] transition-colors ${currentTheme.hover}`}>{data.ticker}</span>
                  </div>
                  <span className="text-sm font-black text-[#111827]">{data.percent.toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <div 
                    className={`h-full ${currentTheme.bar} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${data.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: SECTOR PERCENTAGES */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-[10px] md:text-xs font-black text-slate-400 tracking-widest uppercase">Percentage by Sector</h3>
          </div>

          <div className="bg-white border-2 border-slate-50 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
            {/* Pie Chart */}
            <div className="bg-slate-50/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100 min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie 
                    data={sectorData} 
                    innerRadius={70} 
                    outerRadius={100} 
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
                    content={(props) => {
                      const { payload } = props;
                      return (
                        <ul className="text-[10px] font-bold text-slate-500 space-y-2 ml-4">
                          {payload?.map((entry: any, index: number) => (
                            <li key={`index-${index}`} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-[#111827] truncate max-w-[100px]">{entry.value}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            {/* List */}
            <div className="space-y-4">
              {sectorData.map((data, index) => (
                <div key={data.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className={`font-extrabold text-[#111827] text-sm uppercase tracking-tight transition-colors ${currentTheme.hover}`}>{data.name}</span>
                    </div>
                    <span className="text-sm font-black text-[#111827]">{data.percent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${data.percent}%`, 
                        backgroundColor: COLORS[index % COLORS.length]
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectorAnalytics({ stocks, crypto = [] }: SectorAnalyticsProps) {
  const isUsingCostBasis = (stocks.length > 0 && stocks.every(s => (s.currentPrice || 0) === 0)) || 
                           (crypto.length > 0 && crypto.every(c => (c.currentPrice || 0) === 0));

  if (stocks.length === 0 && crypto.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <PieIcon size={32} className="text-slate-200" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">No Portfolio Data Available</h3>
        <p className="text-slate-400 text-sm font-bold text-center mt-2 max-w-[300px]">
          Your portfolio inventory is empty. Add assets to see the analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* Header */}
      <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
         <div>
            <h2 className="text-xl md:text-2xl font-black text-purple-900 tracking-tighter">Portfolio Concentration</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
              <p className="text-sm text-purple-600 font-extrabold uppercase tracking-widest opacity-80">
                Analyzing {stocks.length + crypto.length} assets across all sectors
              </p>
              {isUsingCostBasis && (
                <div className="flex items-center gap-2 text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200 font-black uppercase overflow-hidden animate-in fade-in slide-in-from-left-2 transition-all">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  Showing Cost Basis (Refresh for Market Prices)
                </div>
              )}
            </div>
         </div>
      </div>

      {stocks.length > 0 && (
        <DistributionView 
          assets={stocks} 
          title="Stock Intelligence" 
          accentColor="blue" 
          typeLabel="Stock"
        />
      )}

      {stocks.length > 0 && crypto.length > 0 && (
        <div className="border-t border-slate-100 pt-16" />
      )}

      {crypto.length > 0 && (
        <DistributionView 
          assets={crypto} 
          title="Crypto Intelligence" 
          accentColor="orange" 
          typeLabel="Asset"
        />
      )}
    </div>
  );
}

