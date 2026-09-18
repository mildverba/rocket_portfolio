import { fetchPortfolioData } from "@/actions/sheets";
import { SectorAllocationPage } from "@/components/dashboard/SectorAllocationPage";

export const dynamic = "force-dynamic";

export default async function SectorAnalysisPage() {
  const { assets } = await fetchPortfolioData();

  return <SectorAllocationPage assets={assets} />;
}
