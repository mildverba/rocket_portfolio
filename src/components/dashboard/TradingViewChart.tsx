"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export function TradingViewChart({ symbol = 'WRESBAL', overlays = [] }: { symbol?: string, overlays?: { symbol: string, color: string }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    containerRef.current.innerHTML = '';
    
    const innerContainer = document.createElement('div');
    innerContainer.className = 'tradingview-widget-container__widget h-[calc(100%-32px)] w-full';
    containerRef.current.appendChild(innerContainer);

    const copyrightInfo = document.createElement('div');
    copyrightInfo.className = 'tradingview-widget-copyright';
    copyrightInfo.innerHTML = `<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text text-[10px]">Track all markets on TradingView</span></a>`;
    containerRef.current.appendChild(copyrightInfo);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const widgetConfig: Record<string, unknown> = {
      autosize: true,
      symbol: symbol,
      interval: "W",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com"
    };

    if (overlays.length > 0) {
      widgetConfig.studies = overlays.map(ov => ({
        id: "Overlay@tv-basicstudies",
        inputs: {
          symbol: ov.symbol
        },
        styles: {
          line: {
            color: ov.color
          }
        }
      }));
    }

    script.innerHTML = JSON.stringify(widgetConfig);
    
    script.onload = () => setIsLoading(false);
    script.onerror = () => setHasError(true);
    
    setIsLoading(true);
    setHasError(false);
    containerRef.current.appendChild(script);
    
    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [symbol, overlays]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50 flex flex-col">
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-10 p-6 text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Widget Unavailable</h3>
          <p className="text-sm font-bold text-slate-500 mt-2 max-w-sm">
            The TradingView chart could not be loaded. Please check your connection or try again later.
          </p>
        </div>
      ) : isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-10 transition-opacity duration-300">
          <div className="bg-purple-50 p-4 rounded-full mb-4 shadow-sm border border-purple-100">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <p className="text-sm font-black text-purple-700 animate-pulse tracking-widest uppercase">Loading Chart...</p>
        </div>
      ) : null}
      
      <div 
        className="tradingview-widget-container h-full w-full flex-1"
        ref={containerRef}
      />
    </div>
  );
}
