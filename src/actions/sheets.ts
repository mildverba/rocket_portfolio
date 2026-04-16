"use server";

import { google } from "googleapis";
import { Asset } from "@/lib/types";

export async function fetchPortfolioData(): Promise<{ assets: Asset[], error?: string, fetchTime?: string }> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return { assets: [], error: "Missing Google Sheets configuration in environment variables." };
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A1:Z", 
    });

    const allRows = response.data.values;
    if (!allRows || allRows.length === 0) {
      return { assets: [] };
    }

    const headers = allRows[0].map(h => (h || "").toString().toLowerCase().trim());
    const rows = allRows.slice(1);

    const tickerIdx = headers.findIndex(h => h === "ticker" || h === "symbol" || h === "asset");
    const nameIdx = headers.findIndex(h => h === "name" || h === "company");
    const categoryIdx = headers.findIndex(h => h === "category" || h === "group" || h === "type");
    const sharesIdx = headers.findIndex(h => h === "amount" || h === "shares" || h === "quantity" || h === "total");
    const buyPriceIdx = headers.findIndex(h => h === "buy price" || h === "avg price" || h === "purchase price" || h === "cost");
    const currentPriceIdx = headers.findIndex(h => h === "current price" || h === "price" || h === "market price");
    const brokerIdx = headers.findIndex(h => h === "broker" || h === "platform" || h === "account");

    const fetchTime = new Date().toLocaleTimeString();

    const aggregatedMap = new Map<string, {
      ticker: string;
      name: string;
      group: string;
      totalShares: number;
      totalCost: number;
      currentPrice: number;
      brokers: Set<string>;
      breakdown: Record<string, number>;
    }>();

    rows.forEach((row) => {
      if (!row || row.length === 0) return;
      
      const ticker = (tickerIdx !== -1 && row[tickerIdx]) ? row[tickerIdx].toString().toUpperCase().trim() : "";
      if (!ticker) return;

      const name = (nameIdx !== -1 && row[nameIdx]) ? row[nameIdx].toString().trim() : ticker;
      const group = (categoryIdx !== -1 && row[categoryIdx]) ? row[categoryIdx].toString().trim() : "Other";
      
      const rawShares = (sharesIdx !== -1 && row[sharesIdx]) ? row[sharesIdx].toString() : "0";
      const shares = parseFloat(rawShares.replace(",", ".")) || 0;
      
      const rawAvgPrice = (buyPriceIdx !== -1 && row[buyPriceIdx]) ? row[buyPriceIdx].toString() : "0";
      const avgPrice = parseFloat(rawAvgPrice.replace(/[€$,\s]/g, "").replace(",", ".")) || 0;
      
      const rawCurrentPrice = (currentPriceIdx !== -1 && row[currentPriceIdx]) ? row[currentPriceIdx].toString() : "0";
      const currentPrice = parseFloat(rawCurrentPrice.replace(/[€$,\s]/g, "").replace(",", ".")) || 0;
      
      const broker = (brokerIdx !== -1 && row[brokerIdx]) ? row[brokerIdx].toString().trim() : "Unknown";

      const existing = aggregatedMap.get(ticker);
      if (existing) {
        existing.totalShares += shares;
        existing.totalCost += (shares * avgPrice);
        existing.currentPrice = currentPrice;
        if (broker) {
          existing.brokers.add(broker);
          existing.breakdown[broker] = (existing.breakdown[broker] || 0) + shares;
        }
      } else {
        const brokersSet = new Set<string>();
        if (broker) brokersSet.add(broker);
        
        const initialBreakdown: Record<string, number> = {};
        if (broker) initialBreakdown[broker] = shares;

        aggregatedMap.set(ticker, {
          ticker,
          name,
          group,
          totalShares: shares,
          totalCost: (shares * avgPrice),
          currentPrice,
          brokers: brokersSet,
          breakdown: initialBreakdown
        });
      }
    });

    const rawAssets: Asset[] = Array.from(aggregatedMap.values()).map((data, index) => ({
      id: `asset-${index}`,
      ticker: data.ticker,
      name: data.name,
      group: data.group,
      shares: data.totalShares,
      avgPrice: data.totalShares > 0 ? data.totalCost / data.totalShares : 0,
      currentPrice: data.currentPrice,
      broker: Array.from(data.brokers).join(", "),
      breakdown: Object.entries(data.breakdown).map(([b, s]) => ({ broker: b, shares: s })),
      portfolioPercent: 0,
    }));

    const totalValue = rawAssets.reduce((sum, asset) => sum + (asset.shares * asset.currentPrice), 0);
    
    let assets = rawAssets;
    if (totalValue > 0) {
      assets = rawAssets.map(asset => ({
        ...asset,
        portfolioPercent: ((asset.shares * asset.currentPrice) / totalValue) * 100
      }));
    }

    return { assets, fetchTime };

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching Google Sheets data:", err);
    return { assets: [], error: "Failed to fetch portfolio data: " + err.message, fetchTime: new Date().toLocaleTimeString() };
  }
}
