import React from "react";

interface CtcStatsCardsProps {
  minCtc: number;
  maxCtc: number;
  avgCtc: number;
  medianCtc: number;
  totalStudentsPlaced: number;
}

const CtcStatsCards: React.FC<CtcStatsCardsProps> = ({ minCtc, maxCtc, avgCtc, medianCtc, totalStudentsPlaced }) => (
  <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
    <div className="rounded-lg bg-gray-50 p-3 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground text-center break-words leading-tight">Total Students<br />Placed</span>
      <div className="text-xl font-bold mt-1">{totalStudentsPlaced}</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-3 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground text-center">Median CTC</span>
      <div className="text-xl font-bold mt-1">{medianCtc.toFixed(2)} LPA</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-3 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground text-center">Average CTC</span>
      <div className="text-xl font-bold mt-1">{avgCtc.toFixed(2)} LPA</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-3 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground text-center">Max CTC</span>
      <div className="text-xl font-bold mt-1">{maxCtc.toFixed(2)} LPA</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-3 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground text-center">Min CTC</span>
      <div className="text-xl font-bold mt-1">{minCtc.toFixed(2)} LPA</div>
    </div>
  </div>
);

export default CtcStatsCards; 