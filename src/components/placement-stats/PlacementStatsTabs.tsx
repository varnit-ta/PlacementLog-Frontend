import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart2, Users, Building2 } from "lucide-react";
import OverallStatsCard from "./OverallStatsCard";
import BranchWiseStatsCard from "./BranchWiseStatsCard";
import CompanyStatsTable from "./CompanyStatsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import CtcStatsCards from "./CtcStatsCards";
import OverallCtcLineChart from "./OverallCtcLineChart";
import type { Placement } from "@/lib/placement-api";

interface PlacementStatsTabsProps {
  placements: Placement[];
  branchCompany: any[];
  companyBranch: any[];
  loading: boolean;
  minCtc: number;
  maxCtc: number;
  avgCtc: number;
  medianCtc: number;
}

const PlacementStatsTabs: React.FC<PlacementStatsTabsProps> = ({ placements, branchCompany, companyBranch, loading, minCtc, maxCtc, avgCtc, medianCtc }) => {
  const [activeTab, setActiveTab] = useState("overall");

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
      <h1 className="text-2xl font-bold mb-4">Placement Stats Tracker</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="block sm:hidden mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall Stats</SelectItem>
              <SelectItem value="branch">Branch Wise Stats</SelectItem>
              <SelectItem value="company">Company Wise Stats</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TabsList className="w-full min-w-0 mb-8 p-0 bg-background rounded-none hidden sm:flex sm:grid-cols-3 sm:gap-0 sm:h-14">
          <TabsTrigger value="overall" className="w-full min-w-0 whitespace-nowrap flex flex-row sm:flex-col items-center justify-start sm:justify-center rounded-none bg-background h-12 sm:h-full px-4 sm:px-0 text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary border-b-2 border-transparent transition-all duration-200 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0">
            <BarChart2 className="mr-2 sm:mr-0" />
            <code className="text-[15px] sm:mt-1.5">Overall Stats</code>
          </TabsTrigger>
          <TabsTrigger value="branch" className="w-full min-w-0 whitespace-nowrap flex flex-row sm:flex-col items-center justify-start sm:justify-center rounded-none bg-background h-12 sm:h-full px-4 sm:px-0 text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary border-b-2 border-transparent transition-all duration-200 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0">
            <Users className="mr-2 sm:mr-0" />
            <code className="text-[15px] sm:mt-1.5">Branch Wise Stats</code>
          </TabsTrigger>
          <TabsTrigger value="company" className="w-full min-w-0 whitespace-nowrap flex flex-row sm:flex-col items-center justify-start sm:justify-center rounded-none bg-background h-12 sm:h-full px-4 sm:px-0 text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary border-b-2 border-transparent transition-all duration-200 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0">
            <Building2 className="mr-2 sm:mr-0" />
            <code className="text-[15px] sm:mt-1.5">Company Wise Stats</code>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <CtcStatsCards minCtc={minCtc} maxCtc={maxCtc} avgCtc={avgCtc} medianCtc={medianCtc} />
          <OverallCtcLineChart placements={placements} />
          <OverallStatsCard placements={placements} />
        </TabsContent>
        <TabsContent value="branch">
          <BranchWiseStatsCard branchCompany={branchCompany} placements={placements} />
        </TabsContent>
        <TabsContent value="company">
          <CompanyStatsTable companyBranch={companyBranch} placements={placements} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlacementStatsTabs; 