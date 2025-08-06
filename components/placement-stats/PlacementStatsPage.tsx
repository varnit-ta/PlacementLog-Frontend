"use client";

import React from "react";
import { PlacementsContextProvider, usePlacements } from "@/context/placements-context";
import PlacementStatsTabs from "./PlacementStatsTabs";
import { calculateCtcStats } from "./utils";

function PlacementStatsContent() {
  const { state: placements, branchCompany, companyBranch, loading } = usePlacements();

  // Memoize expensive calculations
  const ctcValues = React.useMemo(() =>
    placements
      .map((p) => p.ctc)
      .filter((v) => typeof v === "number" && !isNaN(v)),
    [placements]
  );
  
  const ctcStats = React.useMemo(() => calculateCtcStats(ctcValues), [ctcValues]);

  const totalStudentsPlaced = React.useMemo(() => {
    return placements.reduce((total, placement) => {
      const placementTotal = placement.branch_counts?.reduce((sum, branch) => sum + (branch.count || 0), 0) || 0;
      return total + placementTotal;
    }, 0);
  }, [placements]);

  return (
    <PlacementStatsTabs
      placements={placements}
      branchCompany={branchCompany}
      companyBranch={companyBranch}
      loading={loading}
      minCtc={ctcStats.min}
      maxCtc={ctcStats.max}
      avgCtc={ctcStats.avg}
      medianCtc={ctcStats.median}
      totalStudentsPlaced={totalStudentsPlaced}
    />
  );
}

const PlacementStatsPage = () => (
  <PlacementsContextProvider>
    <PlacementStatsContent />
  </PlacementsContextProvider>
);

export default PlacementStatsPage; 