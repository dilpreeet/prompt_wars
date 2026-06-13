"use client";

import type { Substitution } from "@/lib/types";

type SubstitutionsListProps = {
  substitutions: Substitution[];
};

export function SubstitutionsList({ substitutions }: SubstitutionsListProps) {
  if (substitutions.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="substitutions-heading"
      className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm"
    >
      <h2 id="substitutions-heading" className="text-lg font-semibold text-amber-950">
        Suggested substitutions
      </h2>
      <p className="mt-1 text-sm text-amber-900/80">
        Smart swaps to match your diet or bring costs down.
      </p>

      <ul className="mt-4 space-y-3">
        {substitutions.map((swap) => (
          <li
            key={`${swap.original}-${swap.replacement}`}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/80 px-4 py-3 text-sm"
          >
            <span className="text-stone-800">
              <span className="font-medium">{swap.original}</span>
              {" → "}
              <span className="font-medium text-emerald-700">{swap.replacement}</span>
            </span>
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
              {swap.reason === "dietary" ? "Dietary" : "Budget"}
              {swap.savings > 0 ? ` · saves $${swap.savings.toFixed(2)}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
