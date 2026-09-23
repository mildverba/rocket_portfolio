"use client";

import { Asset } from "@/lib/types";

const EXPECTED_SECTORS = [
  {
    emoji: "🌍",
    name: "Core ETF",
    target: 37,
    tickers: [
      { ticker: "IWDA", desc: "развитые рынки мира", target: 32, why: "Главная база портфеля, глобальные developed markets", risk: "США/mega-cap tech занимают большую долю" },
      { ticker: "EMIM", desc: "emerging markets", target: 5, why: "Добавляет emerging markets, которых мало/нет в IWDA", risk: "Китай, валюты EM, политика" },
    ],
  },
  {
    emoji: "💻",
    name: "Technology / Growth / Fintech",
    target: 27,
    tickers: [
      { ticker: "AMZN", desc: "", target: 10.5, why: "AWS, AI, cloud, e-commerce; крупная quality-growth позиция", risk: "Высокий CAPEX, valuation, tech-cycle" },
      { ticker: "GEN", desc: "", target: 7, why: "Cybersecurity / consumer security, cash-flow business", risk: "Концентрация в одной компании" },
      { ticker: "PLTR", desc: "", target: 5, why: "Прямая ставка на AI software/data platforms", risk: "Высокая оценка и волатильность" },
      { ticker: "SOFI", desc: "", target: 3, why: "Fintech / digital banking growth", risk: "Кредитный цикл, ставки, конкуренция" },
      { ticker: "IEVD", desc: "electro cars", target: 1.5, why: "Отдельная ставка на EV/electrification", risk: "Узкая theme, цикличность авто" },
    ],
  },
  {
    emoji: "⚡",
    name: "AI Infra / Energy / Nuclear",
    target: 15,
    tickers: [
      { ticker: "VST", desc: "electricity / power generation", target: 4, why: "Электроэнергия для data centers/AI, генерация", risk: "Power prices, regulation" },
      { ticker: "URNU", desc: "uranium/nuclear ETF", target: 2.5, why: "Широкая ставка на uranium/nuclear supply chain", risk: "Очень цикличный сектор" },
      { ticker: "CBUX", desc: "infrastructure ETF", target: 2.5, why: "Электросети, pipelines, transport, utilities — диверсифицирует energy-блок", risk: "Всё ещё equity, может падать с рынком" },
      { ticker: "XE", desc: "nuclear / SMR", target: 2, why: "Более спекулятивная ставка на advanced nuclear / SMR", risk: "Execution, funding, dilution" },
      { ticker: "VIST", desc: "oil & gas", target: 2, why: "Oil & gas; другой источник прибыли, чем tech/AI", risk: "Нефть, Argentina" },
      { ticker: "SEC0", desc: "semiconductors ETF", target: 2, why: "Semiconductor layer AI: chips, fabs, equipment", risk: "Сильная цикличность, частично уже есть в IWDA" },
    ],
  },
  {
    emoji: "🥉",
    name: "Commodities / Metals",
    target: 6,
    tickers: [
      { ticker: "COPX", desc: "copper miners", target: 4, why: "Долгосрочная ставка на дефицит меди/electrification", risk: "Mining-cycle, copper price" },
      { ticker: "ISLNL", desc: "silver exposure", target: 1.5, why: "Прямая exposure к серебру", risk: "Очень волатильный металл" },
      { ticker: "SILG", desc: "silver miners", target: 0.5, why: "Более leveraged ставка на серебро через miners", risk: "Риск компаний + серебра одновременно" },
    ],
  },
  {
    emoji: "🛡️",
    name: "Bonds + Cash-like",
    target: 10,
    tickers: [
      { ticker: "AGGH", desc: "global bonds", target: 3, why: "Глобальный bond stabilizer, более длинная duration", risk: "Может падать при росте ставок" },
      { ticker: "IBTE", desc: "US Treasuries 1–3Y EUR Hedged", target: 3, why: "Короткие US Treasuries, меньше duration risk", risk: "Доходность снизится при снижении ставок" },
      { ticker: "XEON", desc: "cash-like EUR (money-market)", target: 4, why: "Почти cash: резерв для коррекций и ребалансировки", risk: "Низкий expected return при низких ставках" },
    ],
  },
  {
    emoji: "₿",
    name: "Crypto / High-beta",
    target: 5,
    tickers: [
      { ticker: "BMNR", desc: "Bitmine (ETH)", target: 2.5, why: "ETH-related high-beta exposure", risk: "Очень высокая волатильность" },
      { ticker: "BTDR", desc: "Bitcoin mining+AI Cloud+Data Centers", target: 2.5, why: "BTC mining + AI/cloud/data centers", risk: "BTC-cycle, CAPEX, execution" },
    ],
  },
];

const EXPECTED_TICKERS = EXPECTED_SECTORS.flatMap((s) =>
  s.tickers.map((t) => ({ ticker: t.ticker, desc: t.desc, target: t.target }))
);

const BAR_SCALE = 35;
const CRYPTO_BAR_SCALE = 40;

const getValue = (asset: Asset) => {
  const price = asset.currentPrice > 0 ? asset.currentPrice : asset.avgPrice;
  return (asset.shares || 0) * (price || 0);
};

// Strip exchange suffix: "IWDA.L" → "IWDA", "XEON:XETR" → "XEON"
const normalizeTicker = (ticker: string) => ticker.split(".")[0].split(":")[0].toUpperCase();

const CRYPTO_COLORS = ["#A855F7", "#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#3b82f6", "#ec4899", "#14b8a6"];

export function CryptoAllocation({ allAssets, loading }: Props) {
  const cryptoAssets = allAssets.filter((a) => a.group === "Crypto");
  const cryptoTotal = cryptoAssets.reduce((acc, a) => acc + a.shares * (a.currentPrice || 0), 0);

  // Group by sector from Excel
  const sectorMap: Record<string, { value: number; tickers: { ticker: string; value: number }[] }> = {};
  cryptoAssets.forEach((a) => {
    const sector = a.sector?.trim() || "Other";
    const value = a.shares * (a.currentPrice || 0);
    if (!sectorMap[sector]) sectorMap[sector] = { value: 0, tickers: [] };
    sectorMap[sector].value += value;
    sectorMap[sector].tickers.push({ ticker: a.ticker, value });
  });

  const actualSectors = Object.entries(sectorMap)
    .sort((a, b) => b[1].value - a[1].value)
    .map(([name, data]) => ({
      name,
      pct: cryptoTotal > 0 ? (data.value / cryptoTotal) * 100 : 0,
      tickers: data.tickers
        .sort((a, b) => b.value - a.value)
        .map((t) => ({
          ticker: t.ticker,
          pct: cryptoTotal > 0 ? (t.value / cryptoTotal) * 100 : 0,
        })),
    }));

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="bg-slate-50 rounded-2xl h-64 animate-pulse" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
      {/* Expected — пока пусто */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Expected</h3>
        <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
          <span className="text-sm font-bold text-slate-300 tracking-tight">Coming soon</span>
        </div>
      </div>

      {/* Actual */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Actual</h3>
        {cryptoAssets.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center">
            <span className="text-sm font-bold text-slate-300">Нет данных</span>
          </div>
        ) : (
          <div className="space-y-4">
            {actualSectors.map((sector, i) => (
              <div key={sector.name} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-[#111827] text-sm tracking-tight">{sector.name}</span>
                  <span className="text-sm font-black text-[#111827]">{sector.pct.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((sector.pct / CRYPTO_BAR_SCALE) * 100, 100)}%`,
                      backgroundColor: CRYPTO_COLORS[i % CRYPTO_COLORS.length],
                    }}
                  />
                </div>
                <div className="space-y-1.5 pl-1">
                  {sector.tickers.map((t) => (
                    <div key={t.ticker} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">{t.ticker}</span>
                      <span className="font-bold text-slate-600 tabular-nums">{t.pct.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  allAssets: Asset[];
  loading?: boolean;
}

export function SectorAllocation({ allAssets, loading }: Props) {
  const stocks = allAssets.filter((a) => a.group !== "Crypto");
  // Normalise to stocks-only % using portfolioPercent from API
  // (API already picks sheet price as fallback when Yahoo fails)
  const stocksTotalPct = stocks.reduce((acc, a) => acc + (a.portfolioPercent || 0), 0);

  const tickerPct: Record<string, number> = {};
  const tickerPresent = new Set<string>();
  stocks.forEach((a) => {
    const key = normalizeTicker(a.ticker);
    tickerPresent.add(key);
    const pct = stocksTotalPct > 0 ? ((a.portfolioPercent || 0) / stocksTotalPct) * 100 : 0;
    tickerPct[key] = (tickerPct[key] || 0) + pct;
  });

  const actualSectors = EXPECTED_SECTORS.map((sector) => {
    const sectorPct = sector.tickers.reduce(
      (acc, t) => acc + (tickerPct[t.ticker] || 0),
      0
    );
    const sectorPresent = sector.tickers.some((t) => tickerPresent.has(t.ticker));
    return {
      ...sector,
      actualPct: sectorPct,
      sectorPresent,
      tickers: sector.tickers.map((t) => ({
        ...t,
        inPortfolio: tickerPresent.has(t.ticker),
        actualPct: tickerPct[t.ticker] || 0,
      })),
    };
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="flex justify-between"><div className="h-4 w-40 bg-slate-200 rounded" /><div className="h-4 w-10 bg-slate-200 rounded" /></div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full" />
              <div className="space-y-2">{[...Array(3)].map((_, j) => <div key={j} className="h-3 w-full bg-slate-100 rounded" />)}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          {[...Array(6)].map((_, i) => <div key={i} className="bg-slate-50 rounded-2xl p-5 h-28 animate-pulse" />)}
        </div>
      </div>
    );
  }

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

export function TickerAllocation({ allAssets, loading }: Props) {
  const stocks = allAssets.filter((a) => a.group !== "Crypto");
  // Normalise to stocks-only % using portfolioPercent from API
  const stocksTotalPct = stocks.reduce((acc, a) => acc + (a.portfolioPercent || 0), 0);

  const tickerPct: Record<string, number> = {};
  const tickerPresent = new Set<string>();
  stocks.forEach((a) => {
    const key = normalizeTicker(a.ticker);
    tickerPresent.add(key);
    const pct = stocksTotalPct > 0 ? ((a.portfolioPercent || 0) / stocksTotalPct) * 100 : 0;
    tickerPct[key] = (tickerPct[key] || 0) + pct;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="bg-slate-50 rounded-2xl h-96 animate-pulse" />
        <div className="space-y-2">
          {[...Array(21)].map((_, i) => <div key={i} className="h-8 bg-slate-50 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
      {/* Expected */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
          Expected
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                  Блок
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Актив
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                  Вес
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Зачем нужен
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Основной риск
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {EXPECTED_SECTORS.map((sector) =>
                sector.tickers.map((t, i) => (
                  <tr key={`${sector.name}-${t.ticker}`} className="hover:bg-slate-50/50 transition-colors">
                    {i === 0 && (
                      <td
                        rowSpan={sector.tickers.length}
                        className="px-3 py-2.5 font-black text-[#111827] text-xs align-top border-r border-slate-100 whitespace-nowrap"
                      >
                        {sector.emoji} {sector.name}
                        <div className="font-bold text-purple-600 text-[11px] mt-0.5">{sector.target}%</div>
                      </td>
                    )}
                    <td className="px-3 py-2.5 font-extrabold text-[#111827] whitespace-nowrap">{t.ticker}</td>
                    <td className="px-3 py-2.5 text-right font-black text-purple-600 whitespace-nowrap">{t.target}%</td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs">{t.why}</td>
                    <td className="px-3 py-2.5 text-slate-400 text-xs">{t.risk}</td>
                  </tr>
                ))
              )}
              <tr className="bg-slate-50 border-t border-slate-100">
                <td
                  className="px-3 py-3 font-black text-[#111827] text-xs uppercase tracking-wider"
                  colSpan={2}
                >
                  TOTAL
                </td>
                <td className="px-3 py-3 text-right font-black text-purple-600">100%</td>
                <td colSpan={2} />
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
            const pct = tickerPct[t.ticker] || 0;
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
                      {tickerPresent.has(t.ticker) ? pct.toFixed(1) + "%" : "—"}
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
              {EXPECTED_TICKERS.reduce((acc, t) => acc + (tickerPct[t.ticker] || 0), 0).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
