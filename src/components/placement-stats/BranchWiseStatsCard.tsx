import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartStyle } from "@/components/ui/chart";
import { Pie, PieChart, Sector, Label } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Hash function to generate a color from a string (branch name)
function branchToColor(branch: string): string {
  let hash = 5381;
  for (let i = 0; i < branch.length; i++) {
    hash = (hash * 33) ^ branch.charCodeAt(i);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

interface BranchWiseStatsCardProps {
  branchCompany: any[];
}

const BranchWiseStatsCard: React.FC<BranchWiseStatsCardProps> = ({ branchCompany }) => {
  // Pie data: [{ branch, selections, fill }]
  const branchData = React.useMemo(() => {
    return branchCompany.map((b: any) => ({
      branch: b.branch,
      selections: b.companies.reduce((sum: number, c: any) => sum + (c.count || 0), 0),
      fill: branchToColor(b.branch),
    }));
  }, [branchCompany]);

  const [activeBranch, setActiveBranch] = React.useState(branchData[0]?.branch || "");
  const activeIndex = React.useMemo(
    () => branchData.findIndex((item) => item.branch === activeBranch),
    [activeBranch, branchData]
  );
  const branches = React.useMemo(() => branchData.map((item) => item.branch), [branchData]);

  // Chart config for consistent color variables (optional, for ChartStyle)
  const chartConfig = React.useMemo(() => {
    const config: any = {};
    branchData.forEach((d) => {
      config[d.branch] = {
        label: d.branch,
        color: d.fill,
      };
    });
    return config;
  }, [branchData]);
  const id = "pie-interactive-branch";

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 w-full">
        <div className="grid gap-1 w-full sm:w-auto">
          <CardTitle className="text-base sm:text-lg break-words">Branch-wise Placement Contribution</CardTitle>
          <CardDescription className="text-sm break-words">Total selections by branch</CardDescription>
        </div>
        <Select value={activeBranch} onValueChange={setActiveBranch}>
          <SelectTrigger
            className="h-7 w-full sm:w-[180px] rounded-lg pl-2.5 mt-2 sm:mt-0"
            aria-label="Select a branch"
          >
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {branches.map((key) => (
              <SelectItem
                key={key}
                value={key}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-xs"
                    style={{ backgroundColor: branchToColor(key) }}
                  />
                  {key}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px] sm:max-w-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              key={activeIndex}
              data={branchData}
              dataKey="selections"
              nameKey="branch"
              innerRadius={60}
              paddingAngle={1}
              strokeWidth={10}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold break-words"
                        >
                          {branchData[activeIndex]?.selections?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground break-words"
                        >
                          Selections
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Legend below the pie chart */}
        <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 w-full">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {branchData.map((d) => (
              <div key={d.branch} className="flex items-center gap-2 break-words">
                <span
                  className="inline-block h-3 w-3 rounded-sm border"
                  style={{ backgroundColor: d.fill }}
                />
                <span className="truncate" title={d.branch}>{d.branch}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchWiseStatsCard; 