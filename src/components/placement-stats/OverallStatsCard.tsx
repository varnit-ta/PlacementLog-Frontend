import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, Bar, BarChart, LabelList } from "recharts";
import { type Placement } from "@/lib/placement-api";
import { groupSelectionsByDynamicRange } from "./utils";
import { TrendingUp } from "lucide-react";

interface OverallStatsCardProps {
  placements: Placement[];
}

const OverallStatsCard: React.FC<OverallStatsCardProps> = ({ placements }) => {
  const chartData = React.useMemo(() => groupSelectionsByDynamicRange(placements), [placements]);
  const chartConfig: ChartConfig = {
    selections: {
      label: "Total Placed",
      color: "var(--chart-1)",
    },
  };
  const ctcRanges = [
    { label: "<5 LPA", min: 0, max: 5 },
    { label: "5-10 LPA", min: 5, max: 10 },
    { label: "10-15 LPA", min: 10, max: 15 },
    { label: "15-20 LPA", min: 15, max: 20 },
    { label: ">20 LPA", min: 20, max: Infinity },
  ];
  const ctcBarData = React.useMemo(() => {
    const counts = ctcRanges.map(r => ({ ...r, count: 0 }));
    placements.forEach(p => {
      if (!Array.isArray(p.branch_counts)) return;
      const total = p.branch_counts.reduce((sum, b) => sum + (b.count || 0), 0);
      const ctc = p.ctc;
      if (typeof ctc !== "number") return;
      for (const r of counts) {
        if (ctc >= r.min && ctc < r.max) {
          r.count += total;
          break;
        }
      }
    });
    return counts.map(r => ({ range: r.label, count: r.count }));
  }, [placements]);
  const ctcBarConfig: ChartConfig = {
    count: {
      label: "Students",
      color: "var(--chart-2)",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total People Placed by Timeline</CardTitle>
        <CardDescription>Shows the total number of people placed (by day, month, or year depending on data range)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[300px] w-full max-w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="selections"
              type="linear"
              stroke="var(--color-selections)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        {/* CTC Bar Chart */}
        <div className="mt-8">
          <CardTitle className="text-base mb-2">Placements by CTC Range</CardTitle>
          <ChartContainer config={ctcBarConfig} className="h-[200px] w-full max-w-full">
            <BarChart
              accessibilityLayer
              data={ctcBarData}
              margin={{ top: 20, left: 8, right: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="range"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallStatsCard; 