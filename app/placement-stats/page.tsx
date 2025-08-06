import type { Metadata } from "next";
import PlacementStatsPage from "@/components/placement-stats/PlacementStatsPage";

export const metadata: Metadata = {
  title: "VIT Placement Statistics 2026 - Complete Placement Data & CTC Analysis",
  description: "Comprehensive VIT placement statistics for 2026 batch including CTC data, company-wise placements, branch-wise analytics, and salary packages. Get detailed insights into VIT placement trends and top recruiting companies.",
  keywords: "vit placement statistics, vit placement data 2026, vit ctc analysis, vit company wise placement, vit branch wise placement, vit salary packages, vit placement trends, vellore institute placement stats",
  openGraph: {
    title: "VIT Placement Statistics 2026 - Complete Placement Data & CTC Analysis",
    description: "Comprehensive VIT placement statistics for 2026 batch including CTC data, company-wise placements, and branch-wise analytics.",
    type: "website",
    url: "https://placement-log.vercel.app/placement-stats",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIT Placement Statistics 2026",
    description: "Complete placement data and CTC analysis for VIT 2026 batch",
  },
};

export default function PlacementStatsPageRoute() {
  return <PlacementStatsPage />;
}
