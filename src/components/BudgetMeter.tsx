"use client";

import type { FeasibilityResult } from "@/lib/types";

type BudgetMeterProps = {
  feasibility: FeasibilityResult;
  label?: string;
};

export function BudgetMeter({ feasibility, label = "Budget" }: BudgetMeterProps) {
  const { feasible, total, budget, overBy } = feasibility;
  const percentage = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const barColor = feasible ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-stone-700">{label}</span>
        <span className="tabular-nums text-stone-600">
          ${total.toFixed(2)} / ${budget.toFixed(2)}
        </span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${feasible ? "within budget" : `over by $${overBy.toFixed(2)}`}`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p
        className={`text-sm font-medium ${feasible ? "text-emerald-700" : "text-rose-700"}`}
      >
        {feasible
          ? "Within budget — you're good to shop!"
          : `Over budget by $${overBy.toFixed(2)} — check substitutions below.`}
      </p>
    </div>
  );
}
