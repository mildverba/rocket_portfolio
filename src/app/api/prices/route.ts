import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

// Initialize the Yahoo Finance instance as required by v3
const yahooInstance = new YahooFinance();

export const dynamic = "force-dynamic";

// Specific mappings for Stocks/ETFs provided by the user
function mapTickerToYahoo(ticker: string): string {
  const t = ticker.toUpperCase().trim();
  if (t === "SILVER" || t === "SSLN" || t === "SSLN.L") return "SSLN.L";
  if (t === "EMIM") return "EMIM.DE";
  if (t === "SOFI") return "SOFI";
  
  if (ticker.includes(":XETR")) return ticker.replace(":XETR", ".DE");
  if (ticker.includes(":PAR")) return ticker.replace(":PAR", ".PA");
  if (ticker.includes(":AMS")) return ticker.replace(":AMS", ".AS");
  if (ticker.includes(":LON")) return ticker.replace(":LON", ".L");
  
  return ticker.replace(":", ".");
}

async function getEurUsdRate(): Promise<number> {
  // We want: 1 EUR = X USD
  const symbols = ["EURUSD=X", "EUR=X", "USDEUR=X"];
  
  for (const sym of symbols) {
    try {
      console.log(`[API] FX Check: ${sym}`);
      const quote = await yahooInstance.quote(sym);
      if (quote && quote.regularMarketPrice) {
        if (sym === "EURUSD=X" || sym === "EUR=X") {
          return quote.regularMarketPrice;
        } else if (sym === "USDEUR=X") {
          return 1 / quote.regularMarketPrice;
        }
      }
    } catch {
      console.warn(`[API] FX failed for ${sym}`);
    }
  }
  return 1.10; // Updated logical fallback
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "API is alive (Binance + Yahoo)" });
}

export async function POST(req: NextRequest) {
  console.log("[API] POST request started (Binance + Yahoo Scraper)");
  
  try {
    const { assets } = await req.json();
    if (!assets || !Array.isArray(assets)) {
      return NextResponse.json({ error: "Invalid assets data" }, { status: 400 });
    }

    const updatedAssets = assets.map(a => ({ ...a }));
    const stocks = updatedAssets.filter(a => a.group !== "Crypto");
    const cryptos = updatedAssets.filter(a => a.group === "Crypto");

    // Fetch exchange rates
    const eurUsdRate = await getEurUsdRate();
    let eurGbpRate = 0.85; 
    
    try {
      const eurGbpQuote = await yahooInstance.quote("EURGBP=X");
      if (eurGbpQuote && eurGbpQuote.regularMarketPrice) {
        eurGbpRate = eurGbpQuote.regularMarketPrice;
        console.log(`[API] Global Rates: EURUSD=${eurUsdRate}, EURGBP=${eurGbpRate}`);
      }
    } catch {
      console.warn("[API] Failed to fetch live EURGBP rate, using default 0.85");
    }

    // 1. Fetch Crypto Prices (Robust Multi-Source)
    if (cryptos.length > 0) {
      for (const asset of updatedAssets) {
        if (asset.group !== "Crypto") continue;
        
        const ticker = asset.ticker.toUpperCase().trim();
        let priceFound = false;

        // --- SOURCE A: BINANCE (Multiple Mirrors) ---
        const binanceMirrors = [
          "https://api.binance.com",
          "https://api1.binance.com",
          "https://api3.binance.com"
        ];

        for (const mirror of binanceMirrors) {
          if (priceFound) break;
          try {
            const res = await fetch(`${mirror}/api/v3/ticker/price?symbol=${ticker}USDT`, {
              signal: AbortSignal.timeout(3000), // Don't hang the function
              headers: { "User-Agent": "Mozilla/5.0 RocketPortfolioScanner/1.0" }
            });

            if (res.ok) {
              const data = await res.json();
              const priceUsdt = parseFloat(data.price);
              if (priceUsdt > 0) {
                asset.currentPrice = priceUsdt / eurUsdRate;
                console.log(`[API] SUCCESS: Binance (${mirror}) ${ticker}: ${priceUsdt} USDT -> ${asset.currentPrice} EUR`);
                priceFound = true;
              }
            } else {
              console.log(`[API] Binance Mirror Failed (${mirror}): HTTP ${res.status}`);
            }
          } catch (err) {
             console.warn(`[API] Binance Mirror Exception (${mirror}):`, err instanceof Error ? err.message : "Network error");
          }
        }

        // --- SOURCE B: YAHOO FINANCE FALLBACK ---
        if (!priceFound) {
          try {
            // Map common crypto tickers to Yahoo Finance format
            let yahooTicker = `${ticker}-USD`;
            if (ticker === "TON") yahooTicker = "TON11419-USD"; // Accurate Yahoo ID for TON
            if (ticker === "ONDO") yahooTicker = "ONDO-USD";

            console.log(`[API] FALLBACK: Trying Yahoo for ${ticker} (${yahooTicker})`);
            const quote = await yahooInstance.quote(yahooTicker);
            if (quote && quote.regularMarketPrice) {
              asset.currentPrice = quote.regularMarketPrice / eurUsdRate;
              console.log(`[API] SUCCESS: Yahoo Fallback ${ticker}: ${quote.regularMarketPrice} USD -> ${asset.currentPrice} EUR`);
              priceFound = true;
            }
          } catch (err) {
            console.error(`[API] Yahoo Fallback Failed for ${ticker}:`, err instanceof Error ? err.message : "Unknown error");
          }
        }

        if (!priceFound) {
          console.error(`[API] FATAL: Could not fetch price for ${ticker} from any source.`);
        }
      }
    }

    // 2. Fetch Stocks (Yahoo Finance)
    if (stocks.length > 0) {
      for (const asset of updatedAssets) {
        if (asset.group === "Crypto") continue;
        
        const ticker = mapTickerToYahoo(asset.ticker);
        try {
          console.log(`[API] Fetching Yahoo for: ${ticker}`);
          const quote = await yahooInstance.quote(ticker);
          
          if (quote && quote.regularMarketPrice) {
            const price = quote.regularMarketPrice;
            const currency = (quote.currency || "USD").toUpperCase();
            
            console.log(`[API] ${ticker} raw: ${price} ${currency}`);

            // Convert to EUR
            if (currency === "EUR") {
              asset.currentPrice = price;
            } else if (currency === "USD") {
              asset.currentPrice = price / eurUsdRate;
            } else if (currency === "GBP") {
              asset.currentPrice = price / eurGbpRate;
            } else if (currency === "GBX") { 
               asset.currentPrice = (price / 100) / eurGbpRate;
            } else {
              asset.currentPrice = price / eurUsdRate;
            }
            console.log(`[API] ${ticker} final EUR: ${asset.currentPrice}`);
          } else {
            asset.currentPrice = 0;
          }
        } catch (err) {
          console.error(`[API] Yahoo fetch failed for ${asset.ticker}`, err);
          asset.currentPrice = 0;
        }
      }
    }

    const totalValueEur = updatedAssets.reduce((sum, asset) => sum + (asset.shares * asset.currentPrice), 0);
    const finalAssets = updatedAssets.map(asset => ({
      ...asset,
      currentPriceEur: asset.currentPrice,
      currentPriceUsd: asset.currentPrice * eurUsdRate,
      portfolioPercent: totalValueEur > 0 ? ((asset.shares * asset.currentPrice) / totalValueEur) * 100 : 0
    }));

    return NextResponse.json({ updatedAssets: finalAssets });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[API] Major handler error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
