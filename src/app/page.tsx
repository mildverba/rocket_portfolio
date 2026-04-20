export const dynamic = "force-dynamic";

import { PortfolioDashboard } from "@/components/dashboard/PortfolioDashboard";
import { fetchPortfolioData } from "@/actions/sheets";

export default async function Home() {
  const { assets, error, fetchTime } = await fetchPortfolioData();

  return (
    <>
      <div className="bg-red-600 text-white text-center py-4 font-black z-[100] relative">
        DEBUG: IF YOU SEE THIS, THE ANALYTICS LINK IS IN THE SIDEBAR AND IN THE PERFORMANCE SUMMARY CARD BELOW.
      </div>
      <PortfolioDashboard assets={assets} error={error} fetchTime={fetchTime} />
    </>
  );
}
