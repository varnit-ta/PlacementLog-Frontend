import type { Metadata } from "next";
import PlacementStatsPage from "@/components/placement-stats/PlacementStatsPage";

export const metadata: Metadata = {
  title: "Placement Statistics - PlacementLog",
  description: "Comprehensive placement statistics including CTC data, company-wise placements, and branch-wise analytics. Get insights into placement trends and salary packages.",
  keywords: "placement statistics, CTC data, salary packages, company placements, branch wise statistics",
  openGraph: {
    title: "Placement Statistics - PlacementLog",
    description: "Comprehensive placement statistics including CTC data, company-wise placements, and branch-wise analytics.",
    type: "website",
  },
};

export default function PlacementStatsPageRoute() {
  return <PlacementStatsPage />;
}
