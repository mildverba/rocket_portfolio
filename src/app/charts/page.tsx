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
            MMMFFAQ027S <span className="font-bold text-amber-700">(Money Market Funds)</span>
          </h3>
          <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>Несколько недель подряд оттоки</li>
            <li>Не один скачок, а тренд (деньги реально выходят из кэша)</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 mt-8">
          <TradingViewChart symbol="FRED:MMMFFAQ027S" />
        </div>
      </div>
    </div>
  );
}
