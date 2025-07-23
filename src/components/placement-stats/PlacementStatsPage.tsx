import React from "react";
import { PlacementsContextProvider, usePlacements } from "@/context/placements-context";
import PlacementStatsTabs from "./PlacementStatsTabs";
import { calculateCtcStats } from "./utils";

function PlacementStatsContent() {
  const { state: placements, branchCompany, companyBranch, loading } = usePlacements();

  const ctcValues = React.useMemo(() =>
    placements
      .map((p) => p.ctc)
      .filter((v) => typeof v === "number" && !isNaN(v)),
    [placements]
  );
  const { min, max, avg, median } = React.useMemo(() => calculateCtcStats(ctcValues), [ctcValues]);

  return (
    <PlacementStatsTabs
      placements={placements}
      branchCompany={branchCompany}
      companyBranch={companyBranch}
      loading={loading}
      minCtc={min}
      maxCtc={max}
      avgCtc={avg}
      medianCtc={median}
    />
  );
}

const PlacementStatsPage = () => (
  <PlacementsContextProvider>
    <PlacementStatsContent />
  </PlacementsContextProvider>
);

export default PlacementStatsPage; 