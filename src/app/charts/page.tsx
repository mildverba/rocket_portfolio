"use client";

import { TradingViewChart } from "@/components/dashboard/TradingViewChart";
import { MmfWidget } from "@/components/dashboard/MmfWidget";

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

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 mt-8">
          <TradingViewChart 
            symbol="FRED:DFF" 
            overlays={[{ symbol: "FRED:SOFR", color: "#EAB308" }]} 
          />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight leading-relaxed">
            BTC.D = Bitcoin Dominance
          </h3>
          <p className="mt-4 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>BTC.D перестаёт расти -&gt; Ранний altseason</li>
            <li>BTC.D ↓ устойчиво -&gt; Настоящий altseason</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 mt-8">
          <TradingViewChart symbol="CRYPTOCAP:BTC.D" />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight leading-relaxed">
            ETH/BTC
          </h3>
          <p className="mt-4 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>ETH/BTC падает -&gt; Risk-off</li>
            <li>ETH/BTC перестал падать -&gt; Ранний risk-on</li>
            <li>ETH/BTC уверенно ↑ -&gt; Альтсезон</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 mt-8">
          <TradingViewChart symbol="BINANCE:ETHBTC" />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight leading-relaxed">
            TOTAL3 = вся крипта без BTC и ETH (идут ли деньги в альты?)
          </h3>
          <p className="mt-4 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>BTC растёт, TOTAL3 стоит -&gt; Ложный risk-on (деньги идут только в BTC, институционалы risk-on, но альты ещё нет). Не альтсезон.</li>
            <li>TOTAL3 перестал падать, делает higher low, ломает downtrend -&gt; Капитал начинает искать риск, альты просыпаются</li>
            <li>TOTAL3 начинает ускоряться, выше 200 MA (Indicators → Moving Average = Length = 200) -&gt; деньги реально заходят в альты</li>
            <li>TOTAL3 растёт быстрее BTC -&gt; начинается перераспределение риска</li>
            <li>TOTAL3 вертикален -&gt; эйфория, летят x5–x20</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 mt-8">
          <TradingViewChart symbol="CRYPTOCAP:TOTAL3" />
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight leading-relaxed">
            DXY = U.S. Dollar Index (Крипта исторически любит: weak dollar)
          </h3>
          <p className="mt-4 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>DXY ↓ = bullish for crypto</li>
            <li>DXY ↑ резко = ветер против</li>
          </ol>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 mt-8">
          <TradingViewChart symbol="TVC:DXY" />
        </div>
      </div>
    </div>
  );
}
