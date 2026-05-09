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
            WRESBAL <span className="font-bold text-amber-700">(bank reserves)</span>
          </h3>
          <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>устойчиво выше ~$3.1–3.2 трлн</li>
            <li>и растёт 2–4 недели подряд</li>
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

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <TradingViewChart symbol="US10Y" />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6">
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

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <TradingViewChart symbol="US02Y" />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
            MMF <span className="font-bold text-amber-700">(Money Market Funds)</span>
          </h3>
          <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>Несколько недель подряд оттоки</li>
            <li>Не один скачок, а тренд (деньги реально выходят из кэша)</li>
          </ol>
          
          <div className="mt-6 border border-amber-200/60 rounded-xl overflow-hidden bg-white shadow-sm max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Date</th>
                  <th className="py-3 px-4 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Total MMF Assets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">05/06/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,748.81B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">04/29/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,626.46B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">04/22/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,637.44B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">04/15/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,643.00B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">04/08/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,818.81B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">04/01/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,810.85B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">03/25/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,803.27B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">03/18/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,856.28B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">03/11/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,817.60B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">03/04/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,816.83B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">02/25/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,796.72B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">02/18/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,791.02B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">02/11/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,773.89B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">02/04/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,796.59B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">01/28/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,711.57B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">01/21/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,698.52B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">01/14/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,729.36B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">01/07/2026</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,804.10B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">12/30/2025</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,733.31B</td></tr>
                <tr className="hover:bg-slate-50/50 transition-colors"><td className="py-2.5 px-4 text-xs font-medium text-slate-500">12/23/2025</td><td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">$7,673.39B</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
