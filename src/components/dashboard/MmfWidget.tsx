"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function MmfWidget() {
  const [mmfData, setMmfData] = useState<{ date: string; total: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ici-mmf");
      if (!res.ok) throw new Error("Failed to fetch MMF data");
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setMmfData(json.data);
      } else {
         throw new Error("Invalid format");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-sm md:text-base font-extrabold text-amber-900 tracking-tight">
            MMF <span className="font-bold text-amber-700">(Money Market Funds)</span>
          </h3>
          <p className="mt-3 text-sm font-extrabold text-amber-900 tracking-tight">Главные сигналы:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-sm font-semibold text-amber-800 tracking-tight">
            <li>Несколько недель подряд оттоки</li>
            <li>Не один скачок, а тренд (деньги реально выходят из кэша)</li>
          </ol>
        </div>
        <Button 
          onClick={fetchData} 
          disabled={loading}
          variant="outline"
          className="shrink-0 bg-white border-amber-200 text-amber-900 hover:bg-amber-100"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Загрузка..." : "Получить свежие данные"}
        </Button>
      </div>
      
      {error && <p className="mt-4 text-xs font-bold text-red-600">{error}</p>}

      {mmfData.length > 0 && (
        <div className="mt-6 border border-amber-200/60 rounded-xl overflow-hidden bg-white shadow-sm max-h-[400px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Date</th>
                <th className="py-3 px-4 text-[10px] font-extrabold uppercase text-slate-400 tracking-widest text-right">Total MMF Assets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mmfData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 px-4 text-xs font-medium text-slate-500">{row.date}</td>
                  <td className="py-2.5 px-4 text-xs font-extrabold text-[#111827] text-right">
                    ${row.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
