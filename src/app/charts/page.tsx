"use client";

import { TradingViewChart } from "@/components/dashboard/TradingViewChart";

export default function ChartsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tighter">
            Market <span className="text-purple-600">Charts</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            Real-time charting and technical analysis
          </p>
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
            WRESBAL <span className="font-bold text-amber-700">(bank reserves)</span>. Key signals:
          </h3>
          <ol className="mt-3 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>Sustained above ~$3.1–3.2 trillion</li>
            <li>Growing for 2–4 consecutive weeks</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <TradingViewChart symbol="WRESBAL" />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
            Баланс TGA <span className="font-bold text-amber-700">(деньги возвращаются в банки)</span>
          </h3>
          <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>Падает (правительство тратит)</li>
            <li>Особенно резко (–100–300 млрд за месяц)</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <TradingViewChart symbol="FRED:WTREGEN" />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
            Reverse Repo <span className="font-bold text-amber-700">(нет “черной дыры”, которая высасывает ликвидность)</span>
          </h3>
          <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>Падение (или уже у нуля)</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <TradingViewChart symbol="FRED:RRPONTSYD" />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
            MOVE <span className="font-bold text-amber-700">(индекс волатильности рынка облигаций США)</span>
          </h3>
          <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>Падение ниже ~80 → затем к 70 → к 60</li>
            <li>Risk-off больше 100-120. Нейтрально 80-100. Ниже 80 хорошо.</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <TradingViewChart symbol="MOVE" />
        </div>
      </div>
    </div>
  );
}
