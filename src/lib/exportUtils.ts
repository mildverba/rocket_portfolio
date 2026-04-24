/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils, writeFile } from 'xlsx';
import { Asset } from './types';

export const exportAssetsToExcel = (assets: Asset[], filename: string, type: 'stocks' | 'crypto') => {
  let data: any[] = [];

  if (type === 'stocks') {
    data = assets.map(asset => {
      const value = asset.shares * asset.currentPrice;
      const pnl = value - (asset.shares * asset.avgPrice);
      const pnlPerc = asset.avgPrice > 0 ? (pnl / (asset.shares * asset.avgPrice)) * 100 : 0;
      
      return {
        'Ticker': asset.ticker,
        'Company Name': asset.name || asset.ticker,
        'Sector': asset.sector || 'Other',
        'Group': asset.group,
        'Shares': asset.shares,
        'Avg Price (EUR)': asset.avgPrice,
        'Market Price (EUR)': asset.currentPrice,
        'Market Price (USD)': asset.currentPriceUsd || 0,
        'Market Value (EUR)': value,
        'Total P&L (EUR)': pnl,
        'P&L %': pnlPerc.toFixed(2) + '%',
        'Broker': asset.broker || asset.breakdown?.map(b => b.broker).join(", ") || 'N/A'
      };
    });
  } else {
    data = assets.map(asset => {
      const value = asset.shares * asset.currentPrice;
      const pnl = value - (asset.shares * asset.avgPrice);
      const pnlPerc = asset.avgPrice > 0 ? (pnl / (asset.shares * asset.avgPrice)) * 100 : 0;

      return {
        'Ticker': asset.ticker,
        'Quantity': asset.shares,
        'Purchase Price (EUR)': asset.avgPrice,
        'Current Price (EUR)': asset.currentPrice,
        'Market Value (EUR)': value,
        'PnL (EUR)': pnl,
        'PnL %': pnlPerc.toFixed(2) + '%'
      };
    });
  }

  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Portfolio");

  // Generate and download the file
  writeFile(workbook, `${filename}.xlsx`);
};
