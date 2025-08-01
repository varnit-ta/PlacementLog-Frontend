import React from "react";
import { PlacementsContextProvider, usePlacements } from "@/context/placements-context";
import PlacementStatsTabs from "./PlacementStatsTabs";
import { calculateCtcStats } from "./utils";
import SEO from "@/components/SEO";

function PlacementStatsContent() {
  const { state: placements, branchCompany, companyBranch, loading } = usePlacements();

  const ctcValues = React.useMemo(() =>
    placements
      .map((p) => p.ctc)
      .filter((v) => typeof v === "number" && !isNaN(v)),
    [placements]
  );
  const { min, max, avg, median } = React.useMemo(() => calculateCtcStats(ctcValues), [ctcValues]);

  const totalStudentsPlaced = React.useMemo(() => {
    return placements.reduce((total, placement) => {
      const placementTotal = placement.branch_counts.reduce((sum, branch) => sum + (branch.count || 0), 0);
      return total + placementTotal;
    }, 0);
  }, [placements]);

  return (
    <>
      <SEO 
        title="Placement Statistics"
        description="Comprehensive placement statistics including CTC data, company-wise placements, and branch-wise analytics. Get insights into placement trends and salary packages."
        keywords="placement statistics, CTC data, salary packages, company placements, branch wise statistics"
        url="https://placementlog.vercel.app/placement-stats"
      />
      <PlacementStatsTabs
        placements={placements}
        branchCompany={branchCompany}
        companyBranch={companyBranch}
        loading={loading}
        minCtc={min}
        maxCtc={max}
        avgCtc={avg}
        medianCtc={median}
        totalStudentsPlaced={totalStudentsPlaced}
      />
    </>
  );
}

const PlacementStatsPage = () => (
  <PlacementsContextProvider>
    <PlacementStatsContent />
  </PlacementsContextProvider>
);

export default PlacementStatsPage; 