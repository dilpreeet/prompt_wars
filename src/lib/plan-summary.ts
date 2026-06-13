import type { Plan, PlanInput } from "./types";

export function buildPlanSummary(plan: Plan, input: PlanInput): string {
  const mealLines = plan.meals.map(
    (meal) =>
      `- ${meal.recipe.meal}: ${meal.recipe.name} (${meal.servings} servings, $${meal.totalCost.toFixed(2)}, ${meal.recipe.prepMins} min)`,
  );

  const groceryLines = plan.grocery.map(
    (item) =>
      `- ${item.qty} ${item.unit} ${item.item} ($${item.cost.toFixed(2)})${item.checked ? " [checked]" : ""}`,
  );

  const substitutionLines =
    plan.substitutions.length > 0
      ? plan.substitutions.map(
          (swap) =>
            `- ${swap.original} → ${swap.replacement} (${swap.reason}${swap.savings > 0 ? `, saves $${swap.savings.toFixed(2)}` : ""})`,
        )
      : ["- None"];

  return [
    "Household & preferences:",
    `- People: ${input.people}`,
    `- Diet: ${input.diet}`,
    `- Max effort: ${input.maxEffort}`,
    `- Budget: $${input.budget.toFixed(2)}`,
    `- Pantry on hand: ${input.pantryItems?.join(", ") || "none"}`,
    "",
    "Meals:",
    ...mealLines,
    "",
    "Grocery list:",
    ...(groceryLines.length > 0 ? groceryLines : ["- Empty"]),
    "",
    "Budget:",
    `- Total: $${plan.totalCost.toFixed(2)}`,
    `- Feasible: ${plan.feasibility.feasible ? "yes" : `no (over by $${plan.feasibility.overBy.toFixed(2)})`}`,
    "",
    "Substitutions:",
    ...substitutionLines,
    ...(plan.message ? ["", `Note: ${plan.message}`] : []),
  ].join("\n");
}
