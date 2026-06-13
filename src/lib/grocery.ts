import { normalizeItemName } from "./scale";
import type { GroceryItem, ScaledMeal } from "./types";

export function aggregateGroceryList(
  meals: ScaledMeal[],
  pantryItems: string[] = [],
): GroceryItem[] {
  const pantry = new Set(pantryItems.map(normalizeItemName));
  const merged = new Map<
    string,
    { item: string; qty: number; unit: string; cost: number }
  >();

  for (const meal of meals) {
    for (const ingredient of meal.scaledIngredients) {
      const key = `${normalizeItemName(ingredient.item)}::${ingredient.unit}`;
      const existing = merged.get(key);

      if (existing) {
        existing.qty = roundQty(existing.qty + ingredient.qty);
        existing.cost = roundCost(existing.cost + ingredient.cost);
      } else {
        merged.set(key, {
          item: ingredient.item,
          qty: ingredient.qty,
          unit: ingredient.unit,
          cost: ingredient.cost,
        });
      }
    }
  }

  return [...merged.values()]
    .filter((entry) => !pantry.has(normalizeItemName(entry.item)))
    .map((entry) => ({
      id: `${normalizeItemName(entry.item)}-${entry.unit}`,
      item: entry.item,
      qty: entry.qty,
      unit: entry.unit,
      cost: entry.cost,
      checked: false,
    }))
    .sort((a, b) => a.item.localeCompare(b.item));
}

export function groceryTotal(grocery: GroceryItem[]): number {
  const total = grocery.reduce((sum, item) => sum + item.cost, 0);
  return Math.round(total * 100) / 100;
}

function roundQty(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundCost(value: number): number {
  return Math.round(value * 100) / 100;
}
