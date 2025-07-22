import React from "react";
import { PlacementsContextProvider, usePlacements } from "../context/placements-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverallStatsCard from "@/components/placement-stats/OverallStatsCard";
import BranchWiseStatsCard from "@/components/placement-stats/BranchWiseStatsCard";
import CompanyStatsTable from "@/components/placement-stats/CompanyStatsTable";
import { Skeleton } from "@/components/ui/skeleton";

function PlacementStatsContent() {
  const { state: placements, branchCompany, companyBranch, loading } = usePlacements();

  // Calculate CTC stats
  const ctcValues = React.useMemo(() =>
    placements
      .map((p) => p.ctc)
      .filter((v) => typeof v === "number" && !isNaN(v))
      .sort((a, b) => a - b),
    [placements]
  );
  const minCtc = ctcValues.length ? ctcValues[0] : 0;
  const maxCtc = ctcValues.length ? ctcValues[ctcValues.length - 1] : 0;
  const avgCtc = ctcValues.length ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length) : 0;
  const medianCtc = ctcValues.length
    ? (ctcValues.length % 2 === 1
      ? ctcValues[Math.floor(ctcValues.length / 2)]
      : (ctcValues[ctcValues.length / 2 - 1] + ctcValues[ctcValues.length / 2]) / 2)
    : 0;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Skeleton className="mb-6 h-12 w-full rounded-lg" />
        <Skeleton className="mb-4 h-8 w-1/2 rounded" />
        <div className="mb-8 flex flex-col gap-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
        <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* CTC Summary Bar */}
      <div className="mb-6 flex flex-wrap justify-center gap-4 rounded-lg bg-gray-50 p-4 text-sm font-semibold shadow-sm">
        <div>Median CTC: <span className="font-bold">{medianCtc.toFixed(2)} LPA</span></div>
        <div>Average CTC: <span className="font-bold">{avgCtc.toFixed(2)} LPA</span></div>
        <div>Max CTC: <span className="font-bold">{maxCtc.toFixed(2)} LPA</span></div>
        <div>Min CTC: <span className="font-bold">{minCtc.toFixed(2)} LPA</span></div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Placement Stats Tracker</h1>
      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="mb-8 flex flex-wrap gap-2">
          <TabsTrigger value="overall">Overall Stats</TabsTrigger>
          <TabsTrigger value="branch">Branch Wise Stats</TabsTrigger>
          <TabsTrigger value="company">Company Wise Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <OverallStatsCard placements={placements} />
        </TabsContent>
        <TabsContent value="branch">
          <BranchWiseStatsCard branchCompany={branchCompany} />
        </TabsContent>
        <TabsContent value="company">
          <CompanyStatsTable companyBranch={companyBranch} placements={placements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function PlacementStats() {
  return (
    <PlacementsContextProvider>
      <PlacementStatsContent />
    </PlacementsContextProvider>
  );
}
