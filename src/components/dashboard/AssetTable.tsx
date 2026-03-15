import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Asset } from "@/lib/types";

export function AssetTable({ assets, type }: { assets: Asset[]; type: "stocks" | "crypto" }) {
  return (
    <div className="rounded-md border mt-4 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            {type === "stocks" && <TableHead>Group</TableHead>}
            <TableHead>Broker</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Avg Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right whitespace-nowrap">Market Value (EUR)</TableHead>
            <TableHead className="text-right">PnL</TableHead>
            <TableHead className="text-right">Portfolio %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            const investedVal = asset.shares * asset.avgPrice;
            const currentValEur = asset.shares * asset.currentPrice;
            const pnl = currentValEur - investedVal;
            const pnlPercent = investedVal > 0 ? (pnl / investedVal) * 100 : 0;
            const isPositive = pnl >= 0;

            return (
              <TableRow key={asset.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-xs text-muted-foreground">{asset.ticker}</div>
                </TableCell>
                {type === "stocks" && (
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {asset.group}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  {asset.broker ? (
                    <div className="flex flex-wrap gap-1">
                      {asset.broker.split(", ").map((b, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-[10px] px-1.5 py-0 font-medium bg-muted/30 text-muted-foreground border-muted/50"
                        >
                          {b}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono">{asset.shares.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono">€{asset.avgPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-primary">€{asset.currentPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right font-bold text-primary">
                  €{currentValEur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className={`text-right font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  <div className="flex flex-col items-end">
                    <span>{isPositive ? "+" : ""}€{pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-xs font-normal opacity-80">({isPositive ? "+" : ""}{pnlPercent.toFixed(2)}%)</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{asset.portfolioPercent.toFixed(2)}%</TableCell>
              </TableRow>
            );
          })}
          {assets.length === 0 && (
            <TableRow>
              <TableCell colSpan={type === "stocks" ? 9 : 8} className="h-24 text-center text-muted-foreground">
                No positions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
