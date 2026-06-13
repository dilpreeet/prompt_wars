"use client";

import { useCallback, useEffect, useState } from "react";
import { generatePlan } from "@/lib/engine";
import { checkFeasibility } from "@/lib/budget";
import { loadPlan, loadPlanInput, savePlan, savePlanInput } from "@/lib/storage";
import type { Plan, PlanInput } from "@/lib/types";
import { validatePlanInput } from "@/lib/validation";
import { BudgetMeter } from "./BudgetMeter";
import { GroceryList } from "./GroceryList";
import { MealPlanView } from "./MealPlanView";
import { PlannerForm } from "./PlannerForm";
import { SubstitutionsList } from "./SubstitutionsList";
import { EnhancePanel } from "./EnhancePanel";

const defaultInput: PlanInput = {
  people: 2,
  budget: 30,
  diet: "none",
  maxEffort: "medium",
  meals: ["breakfast", "lunch", "dinner"],
  pantryItems: [],
};

export function PlannerApp() {
  const [input, setInput] = useState<PlanInput>(defaultInput);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const savedInput = loadPlanInput();
    const savedPlan = loadPlan();

    if (savedInput) {
      setInput(savedInput);
    }

    if (savedPlan) {
      setPlan(savedPlan);
    }

    setHasHydrated(true);
  }, []);

  const handleGenerate = useCallback(() => {
    setIsSubmitting(true);
    setErrors([]);

    const result = validatePlanInput(input);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      setErrors(messages);
      setIsSubmitting(false);
      return;
    }

    const nextPlan = generatePlan(result.data);
    setPlan(nextPlan);
    savePlanInput(result.data);
    savePlan(nextPlan);
    setIsSubmitting(false);
  }, [input]);

  function handleGroceryToggle(id: string) {
    if (!plan) {
      return;
    }

    const updated: Plan = {
      ...plan,
      grocery: plan.grocery.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    };

    setPlan(updated);
    savePlan(updated);
  }

  const liveFeasibility = plan
    ? checkFeasibility(plan.totalCost, input.budget)
    : {
        feasible: true,
        total: 0,
        budget: input.budget,
        overBy: 0,
      };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-amber-400 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
          PlatePlanner
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Your personal cooking to-do list
        </h1>
        <p className="mt-3 max-w-2xl text-base text-white/90">
          Plan breakfast, lunch, and dinner — get a merged grocery list, budget
          check, and smart substitutions in seconds.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <PlannerForm
          input={input}
          onChange={setInput}
          onSubmit={handleGenerate}
          errors={errors}
          isSubmitting={isSubmitting}
        />

        <aside className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Budget preview
            </h2>
            <div className="mt-3">
              <BudgetMeter feasibility={liveFeasibility} label="Daily budget" />
            </div>
          </div>

          {!hasHydrated && (
            <p className="text-sm text-stone-500">Loading saved plan…</p>
          )}
        </aside>
      </div>

      <section
        id="plan-results"
        aria-labelledby="plan-results-heading"
        aria-live="polite"
        aria-atomic="true"
        className="space-y-8"
      >
        <h2 id="plan-results-heading" className="sr-only">
          Generated plan results
        </h2>
        {plan && plan.message && (
          <div
            role="status"
            className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-900"
          >
            {plan.message}
          </div>
        )}

        {plan && plan.meals.length === 0 && !plan.message && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center">
            <p className="text-lg font-medium text-stone-700">
              No plan yet
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Fill in your preferences and hit &ldquo;Generate my plan&rdquo; to
              get started.
            </p>
          </div>
        )}

        {plan && plan.meals.length > 0 && (
          <>
            <MealPlanView meals={plan.meals} />
            <BudgetMeter feasibility={plan.feasibility} />
            <SubstitutionsList substitutions={plan.substitutions} />
            <EnhancePanel plan={plan} input={input} />
            <GroceryList items={plan.grocery} onToggle={handleGroceryToggle} />
          </>
        )}

        {!plan && hasHydrated && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center">
            <p className="text-lg font-medium text-stone-700">
              Ready when you are
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Your last plan will appear here after you generate one.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
