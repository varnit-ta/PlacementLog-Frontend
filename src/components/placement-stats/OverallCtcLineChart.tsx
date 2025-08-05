import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import type { Placement } from "@/lib/placement-api";
import { calculateCtcStats } from "./utils";

const OverallCtcLineChart: React.FC<{ placements: Placement[] }> = ({ placements }) => {
  const chartData = useMemo(() => {
    if (!placements.length) return [];
    const dates = placements
      .map((p) => p.placement_date)
      .filter(Boolean)
      .map((d) => new Date(d!));
    if (!dates.length) return [];
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    const diffDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const diffMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth()) + 1;
    let granularity: 'day' | 'month' | 'year';
    if (diffDays <= 31) {
      granularity = 'day';
    } else if (diffMonths <= 24) {
      granularity = 'month';
    } else {
      granularity = 'year';
    }
    const binMap: Record<string, number[]> = {};
    placements.forEach((p) => {
      if (!p.placement_date || typeof p.ctc !== "number" || isNaN(p.ctc)) return;
      const date = new Date(p.placement_date);
      let key: string;
      if (granularity === 'day') {
        key = date.toLocaleDateString('default', { day: '2-digit', month: 'short' });
      } else if (granularity === 'month') {
        key = date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
      } else {
        key = date.getFullYear().toString();
      }
      if (!binMap[key]) binMap[key] = [];
      binMap[key].push(p.ctc);
    });
    const sortedKeys = Object.keys(binMap).sort((a, b) => {
      if (granularity === 'day') {
        const dateA = new Date(a + ` ${new Date().getFullYear()}`);
        const dateB = new Date(b + ` ${new Date().getFullYear()}`);
        return dateA.getTime() - dateB.getTime();
      } else if (granularity === 'month') {
        const [ma, ya] = a.split(' ');
        const [mb, yb] = b.split(' ');
        const da = new Date(`${ma} 1, 20${ya}`);
        const db = new Date(`${mb} 1, 20${yb}`);
        return da.getTime() - db.getTime();
      } else {
        return parseInt(a) - parseInt(b);
      }
    });
    return sortedKeys.map((key) => {
      const ctcs = binMap[key];
      const { median, avg, max } = calculateCtcStats([...ctcs]);
      return {
        label: key,
        median: Number(median.toFixed(2)),
        avg: Number(avg.toFixed(2)),
        max: Number(max.toFixed(2)),
      };
    });
  }, [placements]);

  const chartConfig = {
    median: { label: "Median", color: "var(--chart-1)" },
    avg: { label: "Average", color: "var(--chart-2)" },
    max: { label: "Max", color: "var(--chart-3)" },
  };

  if (!chartData.length) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>CTC Trends Over Time</CardTitle>
        <CardDescription>Median, average, and max CTC by {chartData.length > 1 ? (chartData[1].label.match(/\d{4}/) ? (chartData[1].label.length > 4 ? (chartData[1].label.match(/[a-zA-Z]/) ? "month" : "year") : "year") : "day") : "period"}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
            width={500}
            height={260}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${value}L`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="median"
              type="linear"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="0"
            />
            <Line
              dataKey="avg"
              type="linear"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              dataKey="max"
              type="linear"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="2 3"
            />
          </LineChart>
        </ChartContainer>
        <div className="flex gap-6 justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 border-t-2 border-solid" style={{borderColor:"var(--chart-1)"}}></div>
            <span>Median</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 border-t-2 border-dashed" style={{borderColor:"var(--chart-2)"}}></div>
            <span>Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 border-t-2 border-dotted" style={{borderColor:"var(--chart-3)"}}></div>
            <span>Max</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              CTC trends <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing stats for all placements
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OverallCtcLineChart; 