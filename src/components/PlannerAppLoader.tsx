"use client";

import dynamic from "next/dynamic";

export const PlannerApp = dynamic(
  () => import("./PlannerApp").then((module) => module.PlannerApp),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-stone-500 sm:px-6">
        Loading PlatePlanner…
      </div>
    ),
  },
);
