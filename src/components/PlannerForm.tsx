"use client";

import type {
  DietPreference,
  EffortLevel,
  MealSlot,
  PlanInput,
} from "@/lib/types";

type PlannerFormProps = {
  input: PlanInput;
  onChange: (input: PlanInput) => void;
  onSubmit: () => void;
  errors: string[];
  isSubmitting?: boolean;
};

const dietOptions: { value: DietPreference; label: string }[] = [
  { value: "none", label: "No preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
];

const effortOptions: { value: EffortLevel; label: string }[] = [
  { value: "quick", label: "Quick" },
  { value: "medium", label: "Medium" },
  { value: "elaborate", label: "Elaborate" },
];

const mealOptions: { value: MealSlot; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

export function PlannerForm({
  input,
  onChange,
  onSubmit,
  errors,
  isSubmitting = false,
}: PlannerFormProps) {
  function updateField<K extends keyof PlanInput>(key: K, value: PlanInput[K]) {
    onChange({ ...input, [key]: value });
  }

  function toggleMeal(meal: MealSlot) {
    const meals = input.meals.includes(meal)
      ? input.meals.filter((slot) => slot !== meal)
      : [...input.meals, meal];
    updateField("meals", meals);
  }

  function handlePantryChange(value: string) {
    const pantryItems = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    updateField("pantryItems", pantryItems.length > 0 ? pantryItems : []);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      aria-labelledby="planner-form-heading"
      aria-busy={isSubmitting}
    >
      <h2 id="planner-form-heading" className="text-xl font-semibold text-stone-900">
        Plan your day
      </h2>
      <p className="mt-1 text-sm text-stone-600">
        Tell us about your household and we&apos;ll build meals, groceries, and
        budget checks.
      </p>

      {errors.length > 0 && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <ul className="list-inside list-disc space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="people" className="block text-sm font-medium text-stone-700">
            Number of people
          </label>
          <input
            id="people"
            type="number"
            min={1}
            max={20}
            value={input.people}
            onChange={(event) =>
              updateField("people", Number(event.target.value))
            }
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-stone-700">
            Daily budget (${input.budget})
          </label>
          <input
            id="budget"
            type="range"
            min={5}
            max={100}
            step={1}
            value={input.budget}
            onChange={(event) =>
              updateField("budget", Number(event.target.value))
            }
            className="mt-3 w-full accent-orange-600"
            aria-valuemin={5}
            aria-valuemax={100}
            aria-valuenow={input.budget}
            aria-valuetext={`$${input.budget}`}
          />
          <div className="mt-1 flex justify-between text-xs text-stone-500">
            <span>$5</span>
            <span>$100</span>
          </div>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-stone-700">Diet</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {dietOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={input.diet === option.value}
              onClick={() => updateField("diet", option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                input.diet === option.value
                  ? "bg-orange-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-stone-700">
          Max cooking effort
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {effortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={input.maxEffort === option.value}
              onClick={() => updateField("maxEffort", option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                input.maxEffort === option.value
                  ? "bg-orange-600 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-stone-700">Meals to plan</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {mealOptions.map((option) => {
            const selected = input.meals.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleMeal(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                  selected
                    ? "bg-emerald-600 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="pantry" className="block text-sm font-medium text-stone-700">
          Pantry items you already have (comma-separated)
        </label>
        <input
          id="pantry"
          type="text"
          placeholder="e.g. rice, olive oil, eggs"
          value={input.pantryItems?.join(", ") ?? ""}
          onChange={(event) => handlePantryChange(event.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="mt-6 w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Generating plan…" : "Generate my plan"}
      </button>
    </form>
  );
}
