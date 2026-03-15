export type AssetCategory = "STOCKS" | "ETF-Main" | "ETF-OTHERS" | "ETF-Risk" | "ETF-Bond" | "Crypto";

export type Asset = {
  id: string;
  name: string;
  ticker: string;
  group: AssetCategory | string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  currentPriceEur?: number;
  currentPriceUsd?: number;
  broker?: string;
  breakdown?: { broker: string; shares: number }[];
  portfolioPercent: number; // Will be calculated after fetching all
};
