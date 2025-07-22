import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type { Placement } from "@/lib/placement-api";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface CompanyStatsTableProps {
  companyBranch: any[];
  placements: Placement[];
}

const CompanyStatsTable: React.FC<CompanyStatsTableProps> = ({ companyBranch, placements }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = React.useState({}); // Removed row selection state

  // Helper to get earliest placement date for a company
  const getEarliestDate = React.useCallback((company: string) => {
    const dates = placements
      .filter((p) => p.company === company && p.placement_date)
      .map((p) => new Date(p.placement_date));
    if (dates.length === 0) return null;
    return new Date(Math.min(...dates.map((d) => d.getTime())));
  }, [placements]);

  const data = React.useMemo(() =>
    companyBranch.map((c, idx) => {
      const firstDate = getEarliestDate(c.company);
      // Get the first available CTC for the company
      const ctcPlacement = placements.find((p) => p.company === c.company && typeof p.ctc === "number");
      const ctc = ctcPlacement ? `${ctcPlacement.ctc} LPA` : "-";
      return {
        id: idx.toString(),
        company: c.company,
        totalSelections: c.branches.reduce((sum: number, b: any) => sum + (b.count || 0), 0),
        branchBreakdown: c.branches.map((b: any) => `${b.branch}: ${b.count}`).join(", "),
        branchBreakdownArray: c.branches,
        firstPlacementDate: firstDate ? firstDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "-",
        ctc,
      };
    }),
    [companyBranch, getEarliestDate, placements]
  );

  type CompanyRow = typeof data[number];

  const columns = React.useMemo<ColumnDef<CompanyRow>[]>(
    () => [
      // No select column here
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
        accessorKey: "firstPlacementDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Selection Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => row.getValue("firstPlacementDate"),
      },
      {
        accessorKey: "ctc",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CTC
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => row.getValue("ctc"),
      },
      {
        accessorKey: "totalSelections",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Selections
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => row.getValue("totalSelections"),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const [open, setOpen] = useState(false);
          const breakdown = row.original.branchBreakdownArray;
          return (
            <>
              <Dialog open={open} onOpenChange={setOpen}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                      Show Branch Breakdown
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Branch Breakdown for {row.original.company}</DialogTitle>
                    <DialogDescription>
                      {breakdown.length ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-center">BRANCH</TableHead>
                              <TableHead className="text-center">COUNT</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {breakdown.map((b: any) => (
                              <TableRow key={b.branch}>
                                <TableCell className="font-medium text-center">{b.branch.toUpperCase()}</TableCell>
                                <TableCell className="text-center">{b.count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <span>No data available.</span>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose asChild>
                    <Button variant="secondary" className="mt-4 w-full">Close</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </>
          );
        },
      },
    ],
    []
  );

  // Remove rowSelection state and onRowSelectionChange from useReactTable and UI.
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter companies..."
          value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
          onChange={event => table.getColumn("company")?.setFilterValue(event.target.value)}
          className="max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter(col => col.getCanHide()).map(col => (
              <DropdownMenuCheckboxItem
                key={col.id}
                className="capitalize"
                checked={col.getIsVisible()}
                onCheckedChange={value => col.toggleVisibility(!!value)}
              >
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

// Simple tooltip component
const Tooltip: React.FC<{ content: React.ReactNode; children: React.ReactNode }> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span style={{
          position: "absolute", zIndex: 10, left: "50%", top: "100%", transform: "translateX(-50%)", background: "#222", color: "#fff", padding: "6px 10px", borderRadius: 6, fontSize: 12, whiteSpace: "pre-line", marginTop: 4, minWidth: 120, maxWidth: 240
        }}>
          {content}
        </span>
      )}
    </span>
  );
};

export default CompanyStatsTable; 