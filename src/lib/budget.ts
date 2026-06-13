import type {
  FeasibilityResult,
  GroceryItem,
  PlanInput,
  Substitution,
} from "./types";
import { normalizeItemName } from "./scale";

type BudgetAlternative = {
  replacement: string;
  savingsPerUnit: number;
};

const dairyAlternatives: Record<string, string> = {
  milk: "oat milk",
  butter: "olive oil",
  "heavy cream": "coconut cream",
  parmesan: "nutritional yeast",
  "greek yogurt": "coconut yogurt",
  "cheddar cheese": "vegan cheese",
};

const budgetAlternatives: Record<string, BudgetAlternative> = {
  "sirloin steak": { replacement: "chicken thighs", savingsPerUnit: 3.5 },
  "salmon fillet": { replacement: "canned tuna", savingsPerUnit: 3.0 },
  "ground beef": { replacement: "lentils", savingsPerUnit: 2.0 },
  "turkey slices": { replacement: "hummus", savingsPerUnit: 1.5 },
  parmesan: { replacement: "nutritional yeast", savingsPerUnit: 0.4 },
  "heavy cream": { replacement: "coconut milk", savingsPerUnit: 0.8 },
  tofu: { replacement: "chickpeas", savingsPerUnit: 0.5 },
  "maple syrup": { replacement: "honey", savingsPerUnit: 0.6 },
};

export function checkFeasibility(
  total: number,
  budget: number,
): FeasibilityResult {
  const overBy = Math.max(0, roundCost(total - budget));

  return {
    feasible: total <= budget,
    total: roundCost(total),
    budget: roundCost(budget),
    overBy,
  };
}

export function suggestSubstitutions(
  grocery: GroceryItem[],
  input: PlanInput,
): Substitution[] {
  const swaps: Substitution[] = [];
  const applied = new Set<string>();

  for (const item of grocery) {
    const key = normalizeItemName(item.item);
    if (applied.has(key)) {
      continue;
    }

    const dietarySwap = getDietarySubstitution(item, input.diet);
    if (dietarySwap) {
      swaps.push(dietarySwap);
      applied.add(key);
    }
  }

  let workingGrocery = applySwapsToGrocery(grocery, swaps);
  let total = groceryTotal(workingGrocery);
  let feasibility = checkFeasibility(total, input.budget);

  while (!feasibility.feasible) {
    const budgetSwap = getBestBudgetSubstitution(workingGrocery, applied);
    if (!budgetSwap) {
      break;
    }

    swaps.push(budgetSwap);
    applied.add(normalizeItemName(budgetSwap.original));
    workingGrocery = applySwapsToGrocery(workingGrocery, [budgetSwap]);
    total = groceryTotal(workingGrocery);
    feasibility = checkFeasibility(total, input.budget);
  }

  return swaps;
}

function getDietarySubstitution(
  item: GroceryItem,
  diet: PlanInput["diet"],
): Substitution | null {
  if (diet !== "vegan") {
    return null;
  }

  const replacement = dairyAlternatives[normalizeItemName(item.item)];
  if (!replacement) {
    return null;
  }

  return {
    original: item.item,
    replacement,
    reason: "dietary",
    savings: 0,
  };
}

function getBestBudgetSubstitution(
  grocery: GroceryItem[],
  applied: Set<string>,
): Substitution | null {
  const candidates: Substitution[] = [];

  for (const item of grocery) {
    if (applied.has(normalizeItemName(item.item))) {
      continue;
    }

    const alt = budgetAlternatives[normalizeItemName(item.item)];
    if (!alt) {
      continue;
    }

    const savings = roundCost(Math.min(item.cost, alt.savingsPerUnit));
    if (savings <= 0) {
      continue;
    }

    candidates.push({
      original: item.item,
      replacement: alt.replacement,
      reason: "budget",
      savings,
    });
  }

  candidates.sort((a, b) => b.savings - a.savings);
  return candidates[0] ?? null;
}

function applySwapsToGrocery(
  grocery: GroceryItem[],
  swaps: Substitution[],
): GroceryItem[] {
  const swapMap = new Map(
    swaps.map((swap) => [normalizeItemName(swap.original), swap]),
  );

  return grocery.map((item) => {
    const swap = swapMap.get(normalizeItemName(item.item));
    if (!swap) {
      return item;
    }

    return {
      ...item,
      item: swap.replacement,
      cost: roundCost(Math.max(0, item.cost - swap.savings)),
    };
  });
}

function groceryTotal(grocery: GroceryItem[]): number {
  const total = grocery.reduce((sum, item) => sum + item.cost, 0);
  return roundCost(total);
}

function roundCost(value: number): number {
  return Math.round(value * 100) / 100;
}
