import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartStyle } from "@/components/ui/chart";
import { Pie, PieChart, Sector, Label } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateCtcStats, branchToColor } from "./utils";

interface BranchWiseStatsCardProps {
  branchCompany: any[];
  placements: import("@/lib/placement-api").Placement[];
}

const BranchWiseStatsCard: React.FC<BranchWiseStatsCardProps> = ({ branchCompany, placements }) => {
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

  // Get companies for the selected branch
  const companiesForBranch = React.useMemo(() => {
    const branchObj = branchCompany.find((b: any) => b.branch === activeBranch);
    if (!branchObj) return [];
    return branchObj.companies;
  }, [activeBranch, branchCompany]);

  // Precompute a lookup map: { [branch]: { [company]: { ctc, selectionDate } } }
  const branchCompanyDetails = React.useMemo(() => {
    const map: Record<string, Record<string, { ctc: number | null; selectionDate: string }>> = {};
    placements.forEach((p) => {
      p.branch_counts.forEach((b) => {
        const branch = b.branch;
        if (!map[branch]) map[branch] = {};
        // Only set if not already set, to get the earliest placement
        if (!map[branch][p.company]) {
          let selectionDate = "-";
          if (p.placement_date) {
            const d = new Date(p.placement_date);
            if (!isNaN(d.getTime())) {
              selectionDate = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            }
          }
          map[branch][p.company] = {
            ctc: typeof p.ctc === "number" && !isNaN(p.ctc) ? p.ctc : null,
            selectionDate,
          };
        }
      });
    });
    return map;
  }, [placements]);

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

  // Company table data for selected branch
  const companyTableData = React.useMemo(() => {
    return companiesForBranch.map((c: any) => {
      const details = branchCompanyDetails[activeBranch]?.[c.company] || { ctc: null, selectionDate: "-" };
      return {
        company: c.company,
        ctc: details.ctc,
        count: c.count,
        selectionDate: details.selectionDate,
      };
    });
  }, [companiesForBranch, branchCompanyDetails, activeBranch]);

  // Calculate CTC stats for the selected branch
  const branchCtcStats = React.useMemo(() => {
    // Gather all CTCs for placements in the active branch
    const ctcs: number[] = [];
    placements.forEach((p) => {
      if (p.branch_counts.some((b: any) => b.branch === activeBranch) && typeof p.ctc === "number" && !isNaN(p.ctc)) {
        ctcs.push(p.ctc);
      }
    });
    return calculateCtcStats(ctcs);
  }, [placements, activeBranch]);

  // Table columns
  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "company",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue("company")}</span>,
    },
    {
      accessorKey: "ctc",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CTC (in LPA)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const ctc = row.getValue("ctc");
        return <span>{typeof ctc === "number" && !isNaN(ctc) ? ctc : "-"}</span>;
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId);
        const b = rowB.getValue(columnId);
        const isAValid = typeof a === "number" && !isNaN(a);
        const isBValid = typeof b === "number" && !isNaN(b);
        if (!isAValid && !isBValid) return 0;
        if (!isAValid) return 1;
        if (!isBValid) return -1;
        return a - b;
      },
    },
    {
      accessorKey: "count",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue("count")}</span>,
    },
    {
      accessorKey: "selectionDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Selection Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue("selectionDate")}</span>,
    },
  ], []);

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data: companyTableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

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
                  {key.toUpperCase()}
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
                <span className="truncate" title={d.branch}>{d.branch.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Company table for selected branch */}
        <div className="mt-6">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-xs text-muted-foreground">Median CTC</span>
              <div className="text-xl font-bold">{branchCtcStats.median.toFixed(2)} LPA</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-xs text-muted-foreground">Average CTC</span>
              <div className="text-xl font-bold">{branchCtcStats.avg.toFixed(2)} LPA</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-xs text-muted-foreground">Max CTC</span>
              <div className="text-xl font-bold">{branchCtcStats.max.toFixed(2)} LPA</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-xs text-muted-foreground">Min CTC</span>
              <div className="text-xl font-bold">{branchCtcStats.min.toFixed(2)} LPA</div>
            </div>
          </div>
          <h3 className="font-semibold mb-2 text-sm">Companies for {activeBranch.toUpperCase()}</h3>
          <div className="flex items-center py-2">
            <Input
              placeholder="Filter companies..."
              value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("company")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchWiseStatsCard; 