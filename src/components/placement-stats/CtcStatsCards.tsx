import React from "react";

interface CtcStatsCardsProps {
  minCtc: number;
  maxCtc: number;
  avgCtc: number;
  medianCtc: number;
}

const CtcStatsCards: React.FC<CtcStatsCardsProps> = ({ minCtc, maxCtc, avgCtc, medianCtc }) => (
  <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
    <div className="rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground">Median CTC</span>
      <div className="text-xl font-bold">{medianCtc.toFixed(2)} LPA</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground">Average CTC</span>
      <div className="text-xl font-bold">{avgCtc.toFixed(2)} LPA</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground">Max CTC</span>
      <div className="text-xl font-bold">{maxCtc.toFixed(2)} LPA</div>
    </div>
    <div className="rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center shadow-sm w-full">
      <span className="text-xs text-muted-foreground">Min CTC</span>
      <div className="text-xl font-bold">{minCtc.toFixed(2)} LPA</div>
    </div>
  </div>
);

export default CtcStatsCards; 