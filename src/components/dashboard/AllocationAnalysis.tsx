"use client";

import { Asset } from "@/lib/types";

const EXPECTED_SECTORS = [
  {
    emoji: "🌍",
    name: "Широкий рынок / core ETF",
    target: 39,
    tickers: [
      { ticker: "IWDA", desc: "развитые рынки мира", target: 30 },
      { ticker: "EMIM", desc: "emerging markets", target: 5 },
      { ticker: "SPYD", desc: "dividend equities", target: 4 },
    ],
  },
  {
    emoji: "💻",
    name: "Technology / Growth / Fintech",
    target: 28.5,
    tickers: [
      { ticker: "AMZN", desc: "", target: 9 },
      { ticker: "GEN", desc: "", target: 8 },
      { ticker: "PLTR", desc: "", target: 5 },
      { ticker: "SOFI", desc: "", target: 3 },
      { ticker: "OSPN", desc: "", target: 1 },
      { ticker: "VTEX", desc: "", target: 0.5 },
      { ticker: "IEVD", desc: "EV/innovation ETF", target: 2 },
    ],
  },
  {
    emoji: "⚡",
    name: "Energy / Nuclear / Infrastructure",
    target: 15.5,
    tickers: [
      { ticker: "VST", desc: "electricity / power generation", target: 4 },
      { ticker: "VIST", desc: "oil & gas", target: 3 },
      { ticker: "XE", desc: "nuclear / SMR", target: 2 },
      { ticker: "URNU", desc: "uranium/nuclear ETF", target: 3.5 },
      { ticker: "INFR", desc: "infrastructure ETF", target: 3 },
    ],
  },
  {
    emoji: "🥉",
    name: "Commodities / Metals",
    target: 7,
    tickers: [
      { ticker: "COPX", desc: "copper miners", target: 4 },
      { ticker: "ISLNL", desc: "silver exposure", target: 2 },
      { ticker: "SILG", desc: "silver miners", target: 1 },
    ],
  },
  {
    emoji: "🏦",
    name: "Bonds",
    target: 6,
    tickers: [{ ticker: "AGGH", desc: "", target: 6 }],
  },
  {
    emoji: "₿",
    name: "Crypto / high-beta",
    target: 4,
    tickers: [
      { ticker: "BMNR", desc: "", target: 2 },
      { ticker: "BTDR", desc: "", target: 2 },
    ],
  },
];

const EXPECTED_TICKERS = [
  { ticker: "IWDA", desc: "MSCI World", target: 30 },
  { ticker: "EMIM", desc: "Emerging Markets", target: 5 },
  { ticker: "SPYD", desc: "Dividend equities", target: 4 },
  { ticker: "AGGH", desc: "Global bonds", target: 6 },
  { ticker: "AMZN", desc: "Amazon", target: 9 },
  { ticker: "GEN", desc: "Gen Digital", target: 8 },
  { ticker: "PLTR", desc: "Palantir", target: 5 },
  { ticker: "SOFI", desc: "SoFi", target: 3 },
  { ticker: "OSPN", desc: "OneSpan", target: 1 },
  { ticker: "VTEX", desc: "VTEX", target: 0.5 },
  { ticker: "IEVD", desc: "EV thematic ETF", target: 2 },
  { ticker: "VST", desc: "Vistra / electricity", target: 4 },
  { ticker: "VIST", desc: "Vista Energy", target: 3 },
  { ticker: "XE", desc: "X-energy", target: 2 },
  { ticker: "URNU", desc: "Uranium ETF", target: 3.5 },
  { ticker: "INFR", desc: "Infrastructure ETF", target: 3 },
  { ticker: "COPX", desc: "Copper miners ETF", target: 4 },
  { ticker: "ISLNL", desc: "Physical silver", target: 2 },
  { ticker: "SILG", desc: "Silver miners", target: 1 },
  { ticker: "BMNR", desc: "BitMine", target: 2 },
  { ticker: "BTDR", desc: "Bitdeer", target: 2 },
];

const BAR_SCALE = 35;

const getValue = (asset: Asset) => {
  const price = asset.currentPrice > 0 ? asset.currentPrice : asset.avgPrice;
  return (asset.shares || 0) * (price || 0);
};

// Strip exchange suffix: "IWDA.L" → "IWDA", "EMIM.AS" → "EMIM"
const normalizeTicker = (ticker: string) => ticker.split(".")[0].toUpperCase();

interface Props {
  allAssets: Asset[];
}

export function SectorAllocation({ allAssets }: Props) {
  const total = allAssets.reduce((acc, a) => acc + getValue(a), 0);

  const tickerMap: Record<string, number> = {};
  const tickerPresent = new Set<string>();
  allAssets.forEach((a) => {
    const key = normalizeTicker(a.ticker);
    tickerPresent.add(key);
    tickerMap[key] = (tickerMap[key] || 0) + getValue(a);
  });

  const actualSectors = EXPECTED_SECTORS.map((sector) => {
    const sectorVal = sector.tickers.reduce(
      (acc, t) => acc + (tickerMap[t.ticker] || 0),
      0
    );
    const sectorPresent = sector.tickers.some((t) => tickerPresent.has(t.ticker));
    return {
      ...sector,
      actualPct: total > 0 ? (sectorVal / total) * 100 : 0,
      sectorPresent,
      tickers: sector.tickers.map((t) => ({
        ...t,
        inPortfolio: tickerPresent.has(t.ticker),
        actualPct: total > 0 ? ((tickerMap[t.ticker] || 0) / total) * 100 : 0,
      })),
    };
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
      {/* Expected */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
          Expected
        </h3>
        <div className="space-y-4">
          {EXPECTED_SECTORS.map((sector) => (
            <div
              key={sector.name}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-[#111827] text-sm tracking-tight">
                  {sector.emoji} {sector.name}
                </span>
                <span className="text-sm font-black text-purple-600">
                  {sector.target}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full"
                  style={{ width: `${Math.min((sector.target / BAR_SCALE) * 100, 100)}%` }}
                />
              </div>
              <div className="space-y-1.5 pl-1">
                {sector.tickers.map((t) => (
                  <div key={t.ticker} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">
                      {t.ticker}
                      {t.desc && (
                        <span className="font-normal text-slate-400 ml-1">— {t.desc}</span>
                      )}
                    </span>
                    <span className="font-bold text-slate-500">{t.target}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actual */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
          Actual
        </h3>
        <div className="space-y-4">
          {actualSectors.map((sector) => (
            <div
              key={sector.name}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-[#111827] text-sm tracking-tight">
                  {sector.emoji} {sector.name}
                </span>
                <span className="text-sm font-black text-[#111827]">
                  {sector.sectorPresent ? sector.actualPct.toFixed(1) + "%" : "—"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((sector.actualPct / BAR_SCALE) * 100, 100)}%` }}
                />
              </div>
              <div className="space-y-1.5 pl-1">
                {sector.tickers.map((t) => (
                  <div key={t.ticker} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">
                      {t.ticker}
                      {t.desc && (
                        <span className="font-normal text-slate-400 ml-1">— {t.desc}</span>
                      )}
                    </span>
                    <span className={`font-bold w-10 text-right tabular-nums ${t.inPortfolio ? "text-slate-600" : "text-slate-300"}`}>
                      {t.inPortfolio ? t.actualPct.toFixed(1) + "%" : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TickerAllocation({ allAssets }: Props) {
  const total = allAssets.reduce((acc, a) => acc + getValue(a), 0);

  const tickerMap: Record<string, number> = {};
  const tickerPresent = new Set<string>();
  allAssets.forEach((a) => {
    const key = normalizeTicker(a.ticker);
    tickerPresent.add(key);
    tickerMap[key] = (tickerMap[key] || 0) + getValue(a);
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
      {/* Expected */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
          Expected
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Тикер
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Что это
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Цель
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {EXPECTED_TICKERS.map((t) => (
                <tr key={t.ticker} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5 font-extrabold text-[#111827]">{t.ticker}</td>
                  <td className="px-4 py-2.5 text-slate-500 font-medium">{t.desc}</td>
                  <td className="px-4 py-2.5 text-right font-black text-purple-600">
                    {t.target}%
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 border-t border-slate-100">
                <td
                  className="px-4 py-3 font-black text-[#111827] text-xs uppercase tracking-wider"
                  colSpan={2}
                >
                  TOTAL
                </td>
                <td className="px-4 py-3 text-right font-black text-purple-600">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Actual */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
          Actual
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
          {EXPECTED_TICKERS.map((t) => {
            const val = tickerMap[t.ticker] || 0;
            const pct = total > 0 ? (val / total) * 100 : 0;
            const diff = pct - t.target;
            const diffColor =
              Math.abs(diff) < 0.5
                ? "text-slate-400"
                : diff > 0
                ? "text-green-600"
                : "text-red-500";
            const barColor =
              Math.abs(diff) < 0.5
                ? "bg-blue-400"
                : diff > 0
                ? "bg-green-500"
                : "bg-red-400";

            return (
              <div key={t.ticker}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-extrabold text-[#111827]">{t.ticker}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold tabular-nums ${diffColor}`}>
                      {diff > 0 ? "+" : ""}
                      {diff.toFixed(1)}%
                    </span>
                    <span className="text-sm font-black text-[#111827] tabular-nums w-12 text-right">
                      {pct > 0 ? pct.toFixed(1) + "%" : "—"}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${Math.min((pct / BAR_SCALE) * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Total tracked
            </span>
            <span className="text-sm font-black text-[#111827] tabular-nums">
              {total > 0
                ? (
                    (EXPECTED_TICKERS.reduce(
                      (acc, t) => acc + (tickerMap[t.ticker] || 0),
                      0
                    ) /
                      total) *
                    100
                  ).toFixed(1) + "%"
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
