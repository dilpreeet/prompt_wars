import { describe, expect, it, vi } from "vitest";
import { generatePlan } from "../engine";
import type { PlanInput } from "../types";

vi.mock("../recipes", () => ({
  recipes: [],
  getRecipeById: () => undefined,
}));

describe("engine empty plan", () => {
  it("returns an empty plan with a message when no recipes match", () => {
    const input: PlanInput = {
      people: 2,
      budget: 50,
      diet: "vegan",
      maxEffort: "quick",
      meals: ["breakfast"],
    };

    const plan = generatePlan(input);

    expect(plan.meals).toEqual([]);
    expect(plan.grocery).toEqual([]);
    expect(plan.totalCost).toBe(0);
    expect(plan.message).toMatch(/No recipes match/i);
  });
});
