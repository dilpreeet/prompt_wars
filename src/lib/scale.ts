import type { Ingredient, Recipe, ScaledMeal } from "./types";

export function scaleIngredient(
  ingredient: Ingredient,
  servings: number,
): Ingredient {
  return {
    ...ingredient,
    qty: roundQty(ingredient.qty * servings),
    cost: roundCost(ingredient.cost * servings),
  };
}

export function scaleRecipe(recipe: Recipe, servings: number): ScaledMeal {
  const scaledIngredients = recipe.ingredients.map((ingredient) =>
    scaleIngredient(ingredient, servings),
  );
  const totalCost = roundCost(
    scaledIngredients.reduce((sum, ingredient) => sum + ingredient.cost, 0),
  );

  return {
    recipe,
    servings,
    scaledIngredients,
    totalCost,
  };
}

function roundQty(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundCost(value: number): number {
  return Math.round(value * 100) / 100;
}

export function normalizeItemName(item: string): string {
  return item.trim().toLowerCase();
}
