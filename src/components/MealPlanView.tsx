"use client";

import type { ScaledMeal } from "@/lib/types";

const mealLabels: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

const mealIcons: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
};

type MealPlanViewProps = {
  meals: ScaledMeal[];
};

export function MealPlanView({ meals }: MealPlanViewProps) {
  if (meals.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="meal-plan-heading" className="space-y-4">
      <h2 id="meal-plan-heading" className="text-xl font-semibold text-stone-900">
        Your meal plan
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal) => (
          <article
            key={meal.recipe.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                  {mealIcons[meal.recipe.meal]} {mealLabels[meal.recipe.meal]}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-stone-900">
                  {meal.recipe.name}
                </h3>
              </div>
              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800">
                {meal.recipe.prepMins} min
              </span>
            </div>

            <dl className="mt-4 space-y-1 text-sm text-stone-600">
              <div className="flex justify-between">
                <dt>Servings</dt>
                <dd className="font-medium text-stone-800">{meal.servings}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Est. cost</dt>
                <dd className="font-medium text-stone-800">
                  ${meal.totalCost.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Effort</dt>
                <dd className="capitalize font-medium text-stone-800">
                  {meal.recipe.effort}
                </dd>
              </div>
            </dl>

            <ul className="mt-4 space-y-1 border-t border-stone-100 pt-3 text-sm text-stone-600">
              {meal.scaledIngredients.map((ingredient) => (
                <li key={`${meal.recipe.id}-${ingredient.item}`}>
                  {ingredient.qty} {ingredient.unit} {ingredient.item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
