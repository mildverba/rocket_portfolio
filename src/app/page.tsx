export const dynamic = "force-dynamic";

import { PortfolioDashboard } from "@/components/dashboard/PortfolioDashboard";
import { fetchPortfolioData } from "@/actions/sheets";

export default async function Home() {
  const { assets, error } = await fetchPortfolioData();

  return (
    <PortfolioDashboard assets={assets} error={error} />
  );
}
