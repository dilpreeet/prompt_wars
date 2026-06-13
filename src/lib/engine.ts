import { recipes } from "./recipes";
import { scaleRecipe } from "./scale";
import { aggregateGroceryList, groceryTotal } from "./grocery";
import { checkFeasibility, suggestSubstitutions } from "./budget";
import type {
  GroceryItem,
  MealSlot,
  Plan,
  PlanInput,
  Recipe,
  ScaledMeal,
  Substitution,
} from "./types";
import { effortAllowed } from "./types";

export function filterRecipes(input: PlanInput): Recipe[] {
  return recipes.filter((recipe) => matchesDiet(recipe, input.diet));
}

export function matchesDiet(recipe: Recipe, diet: PlanInput["diet"]): boolean {
  if (diet === "none") {
    return true;
  }

  if (diet === "vegetarian") {
    return !recipe.containsMeat;
  }

  return recipe.diet.includes(diet);
}

export function selectMeals(input: PlanInput): {
  meals: ScaledMeal[];
  message?: string;
} {
  const selected: ScaledMeal[] = [];
  const missingSlots: MealSlot[] = [];

  for (const slot of input.meals) {
    const candidates = filterRecipes(input).filter(
      (recipe) =>
        recipe.meal === slot && effortAllowed(recipe.effort, input.maxEffort),
    );

    if (candidates.length === 0) {
      missingSlots.push(slot);
      continue;
    }

    const cheapest = [...candidates].sort(
      (a, b) => a.costPerServing - b.costPerServing,
    )[0];

    selected.push(scaleRecipe(cheapest, input.people));
  }

  if (selected.length === 0) {
    return {
      meals: [],
      message:
        "No recipes match your diet, time, and meal choices. Try relaxing your filters.",
    };
  }

  if (missingSlots.length > 0) {
    const slots = missingSlots.join(", ");
    return {
      meals: selected,
      message: `Could not find a match for: ${slots}. Showing partial plan.`,
    };
  }

  return { meals: selected };
}

export function calculateMealsTotal(meals: ScaledMeal[]): number {
  const total = meals.reduce((sum, meal) => sum + meal.totalCost, 0);
  return Math.round(total * 100) / 100;
}

export function generatePlan(input: PlanInput): Plan {
  const { meals, message } = selectMeals(input);
  const pantryItems = input.pantryItems ?? [];

  if (meals.length === 0) {
    return {
      meals: [],
      grocery: [],
      feasibility: checkFeasibility(0, input.budget),
      substitutions: [],
      totalCost: 0,
      message,
    };
  }

  let grocery = aggregateGroceryList(meals, pantryItems);
  const substitutions = suggestSubstitutions(grocery, input);

  if (substitutions.length > 0) {
    grocery = applySubstitutions(grocery, substitutions);
  }

  const totalCost = groceryTotal(grocery);
  const feasibility = checkFeasibility(totalCost, input.budget);

  return {
    meals,
    grocery,
    feasibility,
    substitutions,
    totalCost,
    message,
  };
}

function applySubstitutions(
  grocery: GroceryItem[],
  substitutions: Substitution[],
): GroceryItem[] {
  const swapMap = new Map(
    substitutions.map((swap) => [swap.original.toLowerCase(), swap]),
  );

  return grocery.map((item) => {
    const swap = swapMap.get(item.item.toLowerCase());
    if (!swap) {
      return item;
    }

    const updatedCost = Math.max(0, roundCost(item.cost - swap.savings));

    return {
      ...item,
      item: swap.replacement,
      cost: updatedCost,
      id: `${swap.replacement.toLowerCase()}-${item.unit}`,
    };
  });
}

function roundCost(value: number): number {
  return Math.round(value * 100) / 100;
}
