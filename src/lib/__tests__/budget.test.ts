import { describe, expect, it } from "vitest";
import { checkFeasibility, suggestSubstitutions } from "../budget";
import { generatePlan } from "../engine";
import { groceryTotal } from "../grocery";
import type { GroceryItem, PlanInput } from "../types";

function applySubstitutions(
  grocery: GroceryItem[],
  substitutions: ReturnType<typeof suggestSubstitutions>,
): GroceryItem[] {
  const swapMap = new Map(
    substitutions.map((swap) => [swap.original.toLowerCase(), swap]),
  );

  return grocery.map((item) => {
    const swap = swapMap.get(item.item.toLowerCase());
    if (!swap) {
      return item;
    }

    return {
      ...item,
      item: swap.replacement,
      cost: Math.max(0, Math.round((item.cost - swap.savings) * 100) / 100),
    };
  });
}

describe("budget", () => {
  it("returns feasible true when total is within budget", () => {
    const result = checkFeasibility(18, 25);

    expect(result.feasible).toBe(true);
    expect(result.total).toBe(18);
    expect(result.budget).toBe(25);
    expect(result.overBy).toBe(0);
  });

  it("returns feasible false and substitutions that bring total under budget", () => {
    const grocery: GroceryItem[] = [
      {
        id: "steak",
        item: "sirloin steak",
        qty: 8,
        unit: "oz",
        cost: 6.5,
        checked: false,
      },
      {
        id: "potatoes",
        item: "potatoes",
        qty: 1,
        unit: "medium",
        cost: 0.5,
        checked: false,
      },
    ];

    const input: PlanInput = {
      people: 1,
      budget: 4,
      diet: "none",
      maxEffort: "elaborate",
      meals: ["dinner"],
    };

    const before = checkFeasibility(groceryTotal(grocery), input.budget);
    expect(before.feasible).toBe(false);

    const substitutions = suggestSubstitutions(grocery, input);
    expect(substitutions.length).toBeGreaterThan(0);

    const adjusted = applySubstitutions(grocery, substitutions);
    const after = checkFeasibility(groceryTotal(adjusted), input.budget);
    expect(after.feasible).toBe(true);
  });

  it("suggests vegan alternatives for dairy ingredients", () => {
    const grocery: GroceryItem[] = [
      {
        id: "milk",
        item: "milk",
        qty: 1,
        unit: "cup",
        cost: 0.5,
        checked: false,
      },
      {
        id: "butter",
        item: "butter",
        qty: 1,
        unit: "tbsp",
        cost: 0.3,
        checked: false,
      },
    ];

    const input: PlanInput = {
      people: 1,
      budget: 50,
      diet: "vegan",
      maxEffort: "quick",
      meals: ["breakfast"],
    };

    const substitutions = suggestSubstitutions(grocery, input);

    expect(substitutions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          original: "milk",
          replacement: "oat milk",
          reason: "dietary",
        }),
        expect.objectContaining({
          original: "butter",
          replacement: "olive oil",
          reason: "dietary",
        }),
      ]),
    );
  });

  it("integrates budget fixes through generatePlan", () => {
    const plan = generatePlan({
      people: 1,
      budget: 3,
      diet: "none",
      maxEffort: "medium",
      meals: ["dinner"],
    });

    expect(plan.substitutions.length).toBeGreaterThan(0);
    expect(plan.feasibility.feasible).toBe(true);
    expect(plan.totalCost).toBeLessThanOrEqual(3);
  });
});
