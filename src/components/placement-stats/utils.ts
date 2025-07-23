import type { Placement } from "@/lib/placement-api";

export function groupSelectionsByMonth(placements: Placement[]): { month: string; selections: number }[] {
  const monthMap: Record<string, number> = {};
  placements.forEach((p: Placement) => {
    if (!p.placement_date) return;
    const date = new Date(p.placement_date);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    // Sum all branch_counts for this placement
    const total = Array.isArray(p.branch_counts)
      ? p.branch_counts.reduce((sum: number, b: { count?: number }) => sum + (b.count || 0), 0)
      : 0;
    if (!monthMap[key]) monthMap[key] = 0;
    monthMap[key] += total;
  });
  // Convert to array sorted by date
  return Object.entries(monthMap)
    .map(([month, count]) => ({ month, selections: count }))
    .sort((a, b) => {
      // Sort by date (parse month and year)
      const [ma, ya] = a.month.split(" ");
      const [mb, yb] = b.month.split(" ");
      const da = new Date(`${ma} 1, ${ya}`);
      const db = new Date(`${mb} 1, ${yb}`);
      return da.getTime() - db.getTime();
    });
}

export function getBranchPieDataFromMapping(branchCompany: any[]) {
  // branchCompany: [{ branch, companies: [{ company, count }] }]
  return branchCompany.map((b) => ({
    branch: b.branch,
    count: b.companies.reduce((sum: number, c: any) => sum + (c.count || 0), 0),
    fill: branchToColor(b.branch),
  }));
}

export function branchToColor(branch: string): string {
  // Simple hash function (djb2)
  let hash = 5381;
  for (let i = 0; i < branch.length; i++) {
    hash = (hash * 33) ^ branch.charCodeAt(i);
  }
  // Map hash to hue (0-359)
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

export function groupSelectionsByDynamicRange(placements: Placement[]): { label: string; selections: number }[] {
  if (!placements.length) return [];
  // Get all valid dates
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
  const map: Record<string, number> = {};
  placements.forEach((p) => {
    if (!p.placement_date) return;
    const date = new Date(p.placement_date);
    let key: string;
    if (granularity === 'day') {
      key = date.toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' });
    } else if (granularity === 'month') {
      key = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    } else {
      key = date.getFullYear().toString();
    }
    const total = Array.isArray(p.branch_counts)
      ? p.branch_counts.reduce((sum: number, b: { count?: number }) => sum + (b.count || 0), 0)
      : 0;
    if (!map[key]) map[key] = 0;
    map[key] += total;
  });
  // Convert to array sorted by date
  return Object.entries(map)
    .map(([label, selections]) => ({ label, selections }))
    .sort((a, b) => {
      // Parse date for sorting
      if (granularity === 'day') {
        return new Date(a.label).getTime() - new Date(b.label).getTime();
      } else if (granularity === 'month') {
        const [ma, ya] = a.label.split(' ');
        const [mb, yb] = b.label.split(' ');
        const da = new Date(`${ma} 1, ${ya}`);
        const db = new Date(`${mb} 1, ${yb}`);
        return da.getTime() - db.getTime();
      } else {
        return parseInt(a.label) - parseInt(b.label);
      }
    });
}

export function calculateCtcStats(ctcs: number[]) {
  if (!ctcs.length) return { min: 0, max: 0, avg: 0, median: 0 };
  const sorted = [...ctcs].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const median = sorted.length % 2 === 1
    ? sorted[Math.floor(sorted.length / 2)]
    : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  return { min, max, avg, median };
} 