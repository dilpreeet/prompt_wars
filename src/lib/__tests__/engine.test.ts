import { describe, expect, it } from "vitest";
import {
  filterRecipes,
  selectMeals,
} from "../engine";
import { getRecipeById } from "../recipes";
import { scaleRecipe } from "../scale";
import type { PlanInput } from "../types";
import { validatePlanInput } from "../validation";

const baseInput: PlanInput = {
  people: 2,
  budget: 50,
  diet: "none",
  maxEffort: "elaborate",
  meals: ["breakfast", "lunch", "dinner"],
};

describe("engine", () => {
  it("filters out meat recipes for vegetarian input", () => {
    const input: PlanInput = { ...baseInput, diet: "vegetarian" };
    const { meals } = selectMeals(input);

    expect(meals.length).toBeGreaterThan(0);
    expect(meals.every((meal) => !meal.recipe.containsMeat)).toBe(true);
    expect(filterRecipes(input).every((recipe) => !recipe.containsMeat)).toBe(
      true,
    );
  });

  it("scales ingredient qty and cost by number of people", () => {
    const recipe = getRecipeById("bf-oatmeal");
    expect(recipe).toBeDefined();

    const forTwo = scaleRecipe(recipe!, 2);
    const forFour = scaleRecipe(recipe!, 4);

    for (const ingredient of forTwo.scaledIngredients) {
      const scaled = forFour.scaledIngredients.find(
        (entry) => entry.item === ingredient.item,
      );
      expect(scaled).toBeDefined();
      expect(scaled!.qty).toBe(ingredient.qty * 2);
      expect(scaled!.cost).toBe(ingredient.cost * 2);
    }

    expect(forFour.totalCost).toBe(forTwo.totalCost * 2);
  });
});

describe("validation", () => {
  it("rejects invalid plan input", () => {
    const negativeBudget = validatePlanInput({
      people: 2,
      budget: -10,
      diet: "none",
      maxEffort: "quick",
      meals: ["breakfast"],
    });

    const noMeals = validatePlanInput({
      people: 2,
      budget: 20,
      diet: "none",
      maxEffort: "quick",
      meals: [],
    });

    expect(negativeBudget.success).toBe(false);
    expect(noMeals.success).toBe(false);
  });
});
