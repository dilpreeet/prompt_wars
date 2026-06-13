import { describe, expect, it } from "vitest";
import { buildPlanSummary } from "../plan-summary";
import { generatePlan } from "../engine";
import { validateEnhanceRequest } from "../validation";

describe("enhance API helpers", () => {
  it("builds a plan summary string from plan and input", () => {
    const input = {
      people: 2,
      budget: 30,
      diet: "vegetarian" as const,
      maxEffort: "medium" as const,
      meals: ["breakfast", "lunch"] as const,
      pantryItems: ["rice"],
    };

    const plan = generatePlan(input);
    const summary = buildPlanSummary(plan, input);

    expect(summary).toContain("People: 2");
    expect(summary).toContain("Diet: vegetarian");
    expect(summary).toContain("Grocery list:");
  });

  it("validates enhance request payload", () => {
    const valid = validateEnhanceRequest({
      planSummary: "Breakfast: oatmeal",
      question: "Any prep tips?",
    });

    const invalid = validateEnhanceRequest({
      planSummary: "",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});
