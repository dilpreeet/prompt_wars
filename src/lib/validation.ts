import { z } from "zod";

export const mealSlotSchema = z.enum(["breakfast", "lunch", "dinner"]);

export const dietPreferenceSchema = z.enum([
  "none",
  "vegetarian",
  "vegan",
  "gluten-free",
]);

export const effortLevelSchema = z.enum(["quick", "medium", "elaborate"]);

export const planInputSchema = z.object({
  people: z.number().int().min(1).max(20),
  budget: z.number().min(0).max(10000),
  diet: dietPreferenceSchema,
  maxEffort: effortLevelSchema,
  meals: z.array(mealSlotSchema).min(1),
  pantryItems: z.array(z.string().trim().min(1)).max(50).optional(),
});

export type PlanInputValues = z.infer<typeof planInputSchema>;

export const enhanceRequestSchema = z.object({
  planSummary: z.string().trim().min(1).max(4000),
  question: z.string().trim().max(500).optional(),
});

export type EnhanceRequestValues = z.infer<typeof enhanceRequestSchema>;

export function validatePlanInput(input: unknown) {
  return planInputSchema.safeParse(input);
}

export function validateEnhanceRequest(input: unknown) {
  return enhanceRequestSchema.safeParse(input);
}
