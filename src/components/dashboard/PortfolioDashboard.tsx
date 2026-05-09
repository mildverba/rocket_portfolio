"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, TrendingUp, TrendingDown, Layers, Briefcase, FileSpreadsheet } from "lucide-react";
import { Asset } from "@/lib/types";
import { SectorAnalytics } from "./SectorAnalytics";
import { exportAssetsToExcel } from "@/lib/exportUtils";
import { TradingViewChart } from "./TradingViewChart";
import { MmfWidget } from "./MmfWidget";

const CRYPTO_COLORS = ["#A855F7", "#fbbf24", "#94a3b8"];

import { fetchPortfolioData } from "@/actions/sheets";

export function PortfolioDashboard({ 
  assets: initialAssets = [], 
  error: initialError, 
  fetchTime: initialFetchTime 
}: { 
  assets?: Asset[], 
  error?: string, 
  fetchTime?: string 
}) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [activeTab, setActiveTab] = useState("stocks");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>(initialError);
  const [fetchTime, setFetchTime] = useState<string | undefined>(initialFetchTime);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(undefined);
    try {
      // 1. Fetch fresh data from Google Sheets first
      const sheetRes = await fetchPortfolioData();
      if (sheetRes.error) throw new Error(sheetRes.error);
      
      const freshAssets = sheetRes.assets;
      if (sheetRes.fetchTime) setFetchTime(sheetRes.fetchTime);

      // 2. Then fetch live prices for these fresh assets
      const response = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assets: freshAssets }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch prices");
      }

      const { updatedAssets } = await response.json();
      if (updatedAssets) {
        setAssets([...updatedAssets]);
      } else {
        setAssets([...freshAssets]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch live prices.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const stocks = assets
    .filter(a => a.group !== "Crypto")
    .sort((a, b) => (b.shares * b.currentPrice) - (a.shares * a.currentPrice));

  const crypto = assets
    .filter(a => a.group === "Crypto")
    .sort((a, b) => (b.shares * b.currentPrice) - (a.shares * a.currentPrice));

  const getEurUsdRate = (a: Asset) => (a.currentPriceUsd && a.currentPrice > 0) ? (a.currentPriceUsd / a.currentPrice) : 1.10;

  const stocksTotal = stocks.reduce((acc, curr) => acc + (curr.shares * curr.currentPrice), 0);
  const cryptoTotal = crypto.reduce((acc, curr) => acc + (curr.shares * curr.currentPrice), 0);
  const portfolioTotal = stocksTotal + cryptoTotal;

  const stocksTotalUsd = stocks.reduce((acc, curr) => acc + (curr.shares * (curr.currentPriceUsd || (curr.currentPrice * 1.10))), 0);
  const cryptoTotalUsd = crypto.reduce((acc, curr) => acc + (curr.shares * (curr.currentPriceUsd || (curr.currentPrice * 1.10))), 0);
  const portfolioTotalUsd = stocksTotalUsd + cryptoTotalUsd;

  const totalInvested = assets.reduce((acc, curr) => acc + (curr.shares * curr.avgPrice), 0);
  const totalPnL = portfolioTotal - totalInvested;
  
  const totalInvestedUsd = assets.reduce((acc, curr) => acc + (curr.shares * curr.avgPrice * getEurUsdRate(curr)), 0);
  const totalPnLUsd = portfolioTotalUsd - totalInvestedUsd;

  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const pnlIsPositive = totalPnL >= 0;

  // Broker Stats
  const brokerStats: Record<string, number> = {};
  stocks.forEach(asset => {
    asset.breakdown?.forEach(item => {
      brokerStats[item.broker] = (brokerStats[item.broker] || 0) + (item.shares * asset.currentPrice);
    });
  });
  const brokerList = Object.entries(brokerStats).sort((a, b) => b[1] - a[1]);

  // Group Stats (Stocks only)
  /*
  const groupStats: Record<string, number> = {};
  stocks.forEach(asset => {
    groupStats[asset.group] = (groupStats[asset.group] || 0) + (asset.shares * asset.currentPrice);
  });
  const groupData = Object.entries(groupStats).map(([name, value]) => ({ 
    name, 
    value,
    percent: stocksTotal > 0 ? (value / stocksTotal) * 100 : 0
  }));
  */

  // Crypto Stats
  let btcVal = 0, ethVal = 0, othersVal = 0;
  crypto.forEach(asset => {
    const val = asset.shares * asset.currentPrice;
    const tick = asset.ticker.toUpperCase();
    if (tick === "BTC" || tick === "BITCOIN") btcVal += val;
    else if (tick === "ETH" || tick === "ETHEREUM") ethVal += val;
    else othersVal += val;
  });
  const cryptoData = [
    { name: "BTC", value: btcVal, percent: cryptoTotal > 0 ? (btcVal/cryptoTotal)*100 : 0 },
    { name: "ETH", value: ethVal, percent: cryptoTotal > 0 ? (ethVal/cryptoTotal)*100 : 0 },
    { name: "Others", value: othersVal, percent: cryptoTotal > 0 ? (othersVal/cryptoTotal)*100 : 0 },
  ].filter(d => d.value > 0);

  /*
  const classSplitData = [
    { name: "Stocks", value: stocksTotal, percent: portfolioTotal > 0 ? (stocksTotal/portfolioTotal)*100 : 0 },
    { name: "Crypto", value: cryptoTotal, percent: portfolioTotal > 0 ? (cryptoTotal/portfolioTotal)*100 : 0 },
  ].filter(d => d.value > 0);
  */

const cardClassName = "bg-white shadow-md border-none rounded-xl flex flex-col";
const headerTitleClass = "text-[12px] font-bold text-slate-400 uppercase tracking-widest opacity-80";

/*
const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="text-[11px] font-bold text-slate-500 space-y-1.5 mt-3 tracking-tight">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="truncate max-w-[70px] text-[#111827]">{entry.value}</span>
          </div>
          <span className="text-[#111827] font-extrabold">{entry.payload?.percent?.toFixed(1)}%</span>
        </li>
      ))}
    </ul>
  );
};
*/

return (
  <div className="min-h-screen bg-white text-[#111827] font-sans selection:bg-purple-100 antialiased tracking-tight">
    {/* Header Bar */}
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="bg-purple-600 p-2 md:p-2.5 rounded-lg shadow-sm">
          <TrendingUp size={18} className="text-white md:w-[20px] md:h-[20px]" />
        </div>
        <h1 className="text-lg md:text-xl font-extrabold tracking-tighter text-[#111827]">Rocket <span className="text-purple-600">Portfolio</span></h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {error && (
           <span className="hidden sm:inline-block text-[10px] md:text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 animate-pulse">
             {error}
           </span>
        )}
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing || assets.length === 0}
          className="rounded-lg border-slate-200 text-[#111827] hover:bg-slate-50 hover:text-purple-600 hover:border-purple-200 transition-all font-extrabold h-9 md:h-10 text-[10px] md:text-xs px-3 md:px-5 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Updating..." : "Refresh"}
        </Button>
      </div>
    </div>

      <div className="p-4 md:p-8 space-y-6 md:space-y-10 flex flex-col">
      
      {activeTab !== "analytics" && (
        <>
        {/* UPPER SECTION (Responsive grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:min-h-[300px]">
        
        {/* Summary Card */}
        <Card className={cardClassName}>
          <CardHeader className="py-4 md:py-5 px-5 md:px-6">
            <CardTitle className={headerTitleClass}>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-5 md:px-6 pb-6 space-y-4 md:space-y-5">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Current Value</p>
              <div className="flex flex-col gap-0.5">
                <div className="text-xl md:text-2xl font-medium tracking-tighter text-slate-500">
                  €{portfolioTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-3xl md:text-4xl font-extrabold tracking-tighter text-[#111827]">
                  ${portfolioTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full inline-flex items-center gap-2 ${pnlIsPositive ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                {pnlIsPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {pnlIsPositive ? "+" : " "}{totalPnLPercent.toFixed(2)}%
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] md:text-xs font-medium ${pnlIsPositive ? "text-green-600/80" : "text-red-600/80"}`}>
                  {pnlIsPositive ? "+" : "-"}€{Math.abs(totalPnL).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className={`text-xs md:text-sm font-extrabold ${pnlIsPositive ? "text-green-700" : "text-red-700"}`}>
                  {pnlIsPositive ? "+" : "-"}${Math.abs(totalPnLUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-5 border-t border-slate-50">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Stocks</span>
                <span className="text-xs md:text-sm font-medium text-slate-500">€{stocksTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className="text-sm md:text-base font-extrabold text-[#111827]">${stocksTotalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Crypto</span>
                <span className="text-xs md:text-sm font-medium text-slate-500">€{cryptoTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className="text-sm md:text-base font-extrabold text-[#111827]">${cryptoTotalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Broker Breakdown Card */}
        <Card className={cardClassName}>
          <CardHeader className="py-4 md:py-5 px-5 md:px-6 flex flex-row items-center justify-between">
            <CardTitle className={headerTitleClass}>Account Custodians</CardTitle>
            <Briefcase size={16} className="text-slate-300" />
          </CardHeader>
          <CardContent className="px-5 md:px-6 pb-6 space-y-5 md:space-y-6">
            <div className="space-y-4 md:space-y-5">
              {brokerList.map(([name, val]) => (
                <div key={name} className="space-y-2">
                  <div className="flex justify-between items-end text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-tight">{name}</span>
                    <span className="text-[#111827] font-extrabold uppercase text-[10px] md:text-xs">€{val.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(val/stocksTotal)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crypto Breakdown Card (Refined format) */}
        <Card className={cardClassName}>
          <CardHeader className="py-4 md:py-5 px-5 md:px-6 flex flex-row items-center justify-between">
            <CardTitle className={headerTitleClass}>Crypto Concentration</CardTitle>
            <Layers size={16} className="text-slate-300" />
          </CardHeader>
          <CardContent className="px-5 md:px-6 pb-6 space-y-5 md:space-y-6">
            <div className="space-y-4 md:space-y-5">
              {cryptoData.map((d, i) => (
                <div key={d.name} className="space-y-2">
                  <div className="flex justify-between items-end text-xs font-bold">
                    <span className="text-[#111827] font-extrabold text-[10px] md:text-xs">{d.name}: €{d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-slate-400 ml-1 font-bold">({d.percent.toFixed(1)}%)</span></span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                    <div className="h-full rounded-full" style={{ width: `${d.percent}%`, backgroundColor: CRYPTO_COLORS[i % CRYPTO_COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
      </>
      )}

      {/* LOWER SECTION (Inventory Table Refinements) */}
      <div className="bg-white shadow-2xl border border-slate-100 rounded-2xl flex flex-col overflow-visible">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
          <CardHeader className="px-5 md:px-8 py-6 md:py-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10">
              <CardTitle className="text-xl md:text-2xl font-extrabold text-[#111827] tracking-tighter">Portfolio <span className="text-purple-600">Inventory</span></CardTitle>
              <TabsList className="bg-slate-100/80 p-1 h-9 md:h-11 rounded-xl">
                <TabsTrigger value="stocks" className="text-[10px] md:text-sm font-extrabold px-3 md:px-6 data-active:bg-white data-active:text-purple-600 data-active:shadow-sm rounded-lg transition-all tracking-tight">
                  Stocks
                </TabsTrigger>
                <TabsTrigger value="crypto" className="text-[10px] md:text-sm font-extrabold px-3 md:px-6 data-active:bg-white data-active:text-purple-600 data-active:shadow-sm rounded-lg transition-all tracking-tight">
                  Crypto
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-[10px] md:text-sm font-extrabold px-3 md:px-6 data-active:bg-white data-active:text-purple-600 data-active:shadow-sm rounded-lg transition-all tracking-tight">
                  Analytics
                </TabsTrigger>
              </TabsList>

            </div>
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] leading-none">
                    <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-green-500 animate-pulse" />
                    Live Sync
                  </div>
                  {fetchTime && (
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                      Sheet: {fetchTime}
                    </span>
                  )}
                </div>
            </div>
          </CardHeader>

          <TabsContent value="stocks" className="m-0 p-0 overflow-visible">
            <div className="px-5 md:px-8 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stock Assets Breakdown</div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => exportAssetsToExcel(stocks, "Stocks_Portfolio", "stocks")}
                className="h-8 px-3 text-purple-600 hover:bg-purple-50 text-[10px] font-black uppercase tracking-wider gap-2 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export Stocks to Excel
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="sticky left-0 z-30 bg-slate-50/95 backdrop-blur-sm px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest pl-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Ticker</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Qty</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Purchase Price (EUR)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Purchase Price (USD)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Current Price (EUR)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Current Price (USD)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Market Value (EUR)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Market Value (USD)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Total P&L (EUR)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Total P&L (USD)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest pr-10">Company Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stocks.map((asset) => {
                    const value = asset.shares * asset.currentPrice;
                    const eurUsdRate = (asset.currentPriceUsd && asset.currentPrice > 0) ? (asset.currentPriceUsd / asset.currentPrice) : 1.10;
                    const avgPriceUsd = asset.avgPrice * eurUsdRate;
                    const valueUsd = asset.shares * (asset.currentPriceUsd || (asset.currentPrice * 1.10));
                    const pnl = value - (asset.shares * asset.avgPrice);
                    const pnlUsd = pnl * eurUsdRate;
                    const pnlPerc = asset.avgPrice > 0 ? (pnl / (asset.shares * asset.avgPrice)) * 100 : 0;

                    return (
                      <tr key={asset.ticker} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="sticky left-0 z-20 bg-white px-4 py-6 pl-10 border-l-2 border-transparent hover:border-purple-600 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#111827] text-base group-hover:text-purple-600 transition-colors tracking-tight">{asset.ticker}</span>
                            <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">{asset.group}</span>
                          </div>
                        </td>
                        <td className="px-4 py-6 text-right">
                          <span className="text-sm font-extrabold text-[#111827] tabular-nums">{asset.shares.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-6 text-right font-mono text-xs text-slate-500 font-medium tabular-nums">
                          €{asset.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-6 text-right font-mono text-xs text-[#111827] font-extrabold tabular-nums">
                          ${avgPriceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-6 text-right font-mono text-xs text-slate-500 font-medium tabular-nums">
                          €{asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-6 text-right font-mono text-xs text-[#111827] font-extrabold tabular-nums">
                          ${asset.currentPriceUsd?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "-"}
                        </td>
                        <td className="px-4 py-6 text-right">
                          <span className="text-base font-medium text-slate-500 tabular-nums">€{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </td>
                        <td className="px-4 py-6 text-right">
                          <span className="text-base font-extrabold text-[#111827] tabular-nums">${valueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </td>
                        <td className="px-4 py-6 text-right">
                          <div className={`text-sm font-medium flex flex-col items-end ${pnl >= 0 ? "text-green-600/80" : "text-red-500/80"}`}>
                            <span>{pnl >= 0 ? "+" : ""}€{Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        </td>
                        <td className="px-4 py-6 text-right">
                          <div className={`text-sm font-extrabold flex flex-col items-end ${pnl >= 0 ? "text-green-600" : "text-red-500"}`}>
                            <span>{pnl >= 0 ? "+" : ""}${Math.abs(pnlUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            <span className="text-[11px] opacity-80 mt-1">{pnl >= 0 ? "+" : ""}{pnlPerc.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-6 pr-10">
                          <span className="text-sm font-medium text-slate-500 max-w-[220px] truncate block tracking-tight">{asset.name || asset.ticker}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="m-0 p-0 overflow-visible">
            <div className="px-5 md:px-8 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Crypto Assets Breakdown</div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => exportAssetsToExcel(crypto, "Crypto_Portfolio", "crypto")}
                className="h-8 px-3 text-purple-600 hover:bg-purple-50 text-[10px] font-black uppercase tracking-wider gap-2 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export Crypto to Excel
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="sticky left-0 z-30 bg-slate-50/95 backdrop-blur-sm px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest pl-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Ticker</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Quantity</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Purchase Price (EUR)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Purchase Price (USD)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Current Price (EUR)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Current Price (USD)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Market Value (EUR)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Market Value (USD)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Total P&L (EUR)</th>
                    <th className="px-4 py-5 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right pr-10">Total P&L (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {crypto.map((asset) => {
                    const value = asset.shares * asset.currentPrice;
                    const pnl = value - (asset.shares * asset.avgPrice);
                    const pnlPerc = asset.avgPrice > 0 ? (pnl / (asset.shares * asset.avgPrice)) * 100 : 0;
                    
                    const eurUsdRate = (asset.currentPriceUsd && asset.currentPrice > 0) ? (asset.currentPriceUsd / asset.currentPrice) : 1.10;
                    const avgPriceUsd = asset.avgPrice * eurUsdRate;
                    const currentPriceUsd = asset.currentPrice * eurUsdRate;
                    const valueUsd = value * eurUsdRate;
                    const pnlUsd = pnl * eurUsdRate;

                    return (
                      <tr key={asset.ticker} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="sticky left-0 z-20 bg-white px-4 py-7 pl-10 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-l-2 border-transparent hover:border-purple-600">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#111827] text-base group-hover:text-purple-600 transition-colors tracking-tight">{asset.ticker}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{asset.name || "Crypto Asset"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-7 text-right">
                          <span className="text-sm font-extrabold text-[#111827] tabular-nums">{asset.shares.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
                        </td>
                        <td className="px-4 py-7 text-right font-mono text-xs text-slate-500 font-medium tabular-nums">
                          €{asset.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                        </td>
                        <td className="px-4 py-7 text-right font-mono text-xs text-[#111827] font-extrabold tabular-nums">
                          ${avgPriceUsd.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                        </td>
                        <td className={`px-4 py-7 text-right font-mono text-xs tabular-nums ${
                          asset.currentPrice === 0 
                            ? "text-red-600 font-medium" 
                            : asset.priceSource === 'sheet'
                              ? "text-blue-600 font-medium"
                              : "font-medium text-slate-500"
                        }`}>
                          €{asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                        </td>
                        <td className="px-4 py-7 text-right font-mono text-xs text-[#111827] font-extrabold tabular-nums">
                          ${currentPriceUsd.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                        </td>
                        <td className="px-4 py-7 text-right">
                          <span className="text-base font-medium text-slate-500 tabular-nums">€{value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </td>
                        <td className="px-4 py-7 text-right">
                          <span className="text-base font-extrabold text-[#111827] tabular-nums">${valueUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </td>
                        <td className="px-4 py-7 text-right">
                          <div className={`text-sm font-medium flex flex-col items-end ${pnl >= 0 ? "text-green-600/80" : "text-red-500/80"}`}>
                            <div className="flex items-center gap-1.5">
                              {pnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              <span>{pnl >= 0 ? "+" : "-"}€{Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-7 text-right pr-10">
                          <div className={`text-sm font-extrabold flex flex-col items-end ${pnl >= 0 ? "text-green-600" : "text-red-500"}`}>
                            <div className="flex items-center gap-1.5">
                              {pnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              <span>{pnl >= 0 ? "+" : "-"}${Math.abs(pnlUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                            <span className="text-[11px] opacity-80 mt-1">{pnl >= 0 ? "+" : ""}{pnlPerc.toFixed(1)}% efficiency</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="m-0 p-0 overflow-visible bg-slate-50/10 rounded-b-2xl">
            <div className="p-4 md:p-6 lg:p-8">
              <Tabs defaultValue="sector" className="flex flex-col gap-4 md:gap-6">
                <TabsList className="bg-slate-100/80 p-1 h-9 md:h-11 rounded-xl w-fit">
                  <TabsTrigger value="sector" className="text-[10px] md:text-sm font-extrabold px-3 md:px-6 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg transition-all tracking-tight">
                    Sector Overview
                  </TabsTrigger>
                  <TabsTrigger value="charts" className="text-[10px] md:text-sm font-extrabold px-3 md:px-6 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg transition-all tracking-tight">
                    Charts
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="sector" className="m-0 bg-white min-h-[400px] rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100">
                  <SectorAnalytics stocks={stocks} crypto={crypto} />
                </TabsContent>
                
                <TabsContent value="charts" className="m-0 bg-white min-h-[400px] rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 flex flex-col space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-[#111827] tracking-tighter">Market <span className="text-purple-600">Charts</span></h2>
                      <p className="text-sm text-slate-500 font-bold tracking-tight">Real-time charting and technical analysis</p>
                    </div>
                  </div>
                  <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6">
                    <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
                      WRESBAL <span className="font-bold text-amber-700">(bank reserves)</span>
                    </h3>
                    <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
                    <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
                      <li>устойчиво выше ~$3.1–3.2 трлн</li>
                      <li>и растёт 2–4 недели подряд</li>
                    </ol>
                  </div>
                  <TradingViewChart symbol="WRESBAL" />

                  <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
                    <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
                      Баланс TGA <span className="font-bold text-amber-700">(деньги возвращаются в банки)</span>
                    </h3>
                    <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
                    <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
                      <li>Падает (правительство тратит)</li>
                      <li>Особенно резко (–100–300 млрд за месяц)</li>
                    </ol>
                  </div>
                  <TradingViewChart symbol="FRED:WTREGEN" />

                  <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
                    <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
                      Reverse Repo <span className="font-bold text-amber-700">(нет “черной дыры”, которая высасывает ликвидность)</span>
                    </h3>
                    <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
                    <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
                      <li>Падение (или уже у нуля)</li>
                    </ol>
                  </div>
                  <TradingViewChart symbol="FRED:RRPONTSYD" />

                  <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
                    <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
                      US10Y <span className="font-bold text-amber-700">(доходность 10-летних облигаций США)</span>
                    </h3>
                    <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
                    <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
                      <li>Плавное падение без резких скачков - идеально</li>
                      <li>Резкое падение -&gt; кризис</li>
                      <li>Резкий рост (длинные свечи)-&gt; плохо</li>
                      <li>Плавный рост - норм.</li>
                    </ol>
                  </div>
                  <TradingViewChart symbol="US10Y" />
                  
                  <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
                    <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
                      US02Y <span className="font-bold text-amber-700">(доходность 2-летних облигаций США)</span>. US02Y ≈ ожидания рынка по ставке ФРС
                    </h3>
                    <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
                    <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
                      <li>Падает -&gt; рынок ждёт снижения ставок, финансовые условия смягчаются</li>
                      <li>Растет -&gt; рынок ждёт ужесточения, ставки могут вырасти</li>
                      <li>Резкие скачки -&gt; неопределённость</li>
                      <li>Мощная связка с US10Y:
                        <ul className="pl-6 mt-1 space-y-1 list-disc">
                          <li>US02Y &gt; US10Y -&gt; Плохо. Рынок ждет рецессию.</li>
                          <li>US02Y падает быстрее US10Y -&gt; ФРС скоро смягчает политику</li>
                        </ul>
                      </li>
                    </ol>
                    <div className="mt-4 space-y-1 text-xs font-bold text-amber-900/80 italic">
                      <p>* US02Y = “что думает рынок о ФРС”</p>
                      <p>* US10Y = “что происходит в экономике”</p>
                    </div>
                  </div>
                  <TradingViewChart symbol="US02Y" />
                  <MmfWidget />

                  <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
                    <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight leading-relaxed">
                      <span className="text-amber-700">SOFR</span> = ставка, под которую банки/фонды занимают деньги overnight под залог Treasuries (цена краткосрочной ликвидности в системе)
                      <br />
                      <span className="text-amber-700">DFF</span> = Effective Federal Funds Rate (реальная overnight ставка между банками США, по которой банки занимают друг у друга резервы.)
                    </h3>
                    <p className="mt-4 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
                    <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
                      <li>SOFR ≈ DFF -&gt; норм (liquidity fine, repo market здоров, банки спокойно занимают деньги, хорошо для акций и крипты)</li>
                      <li>SOFR сильно выше DFF -&gt; stress (проблемы с funding). Нехватка ликвидности. Repo stress</li>
                      <li>SOFR/DFF НЕ говорит “покупай”. Он говорит: “система здорова или трещит?”</li>
                    </ol>
                  </div>
                  <TradingViewChart symbol="MOVE" />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>

    <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #f1f5f9;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #e2e8f0;
      }
    `}</style>
  </div>
);
}
