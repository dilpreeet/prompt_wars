export type MealSlot = "breakfast" | "lunch" | "dinner";

export type DietTag = "vegetarian" | "vegan" | "gluten-free";

export type EffortLevel = "quick" | "medium" | "elaborate";

export type DietPreference = "none" | DietTag;

export type Ingredient = {
  item: string;
  qty: number;
  unit: string;
  cost: number;
  category?: "dairy" | "meat" | "grain" | "produce" | "other";
};

export type Recipe = {
  id: string;
  name: string;
  meal: MealSlot;
  diet: DietTag[];
  containsMeat: boolean;
  effort: EffortLevel;
  costPerServing: number;
  prepMins: number;
  ingredients: Ingredient[];
};

export type ScaledMeal = {
  recipe: Recipe;
  servings: number;
  scaledIngredients: Ingredient[];
  totalCost: number;
};

export type PlanInput = {
  people: number;
  budget: number;
  diet: DietPreference;
  maxEffort: EffortLevel;
  meals: MealSlot[];
  pantryItems?: string[];
};

export type GroceryItem = {
  id: string;
  item: string;
  qty: number;
  unit: string;
  cost: number;
  checked: boolean;
};

export type FeasibilityResult = {
  feasible: boolean;
  total: number;
  budget: number;
  overBy: number;
};

export type Substitution = {
  original: string;
  replacement: string;
  reason: "dietary" | "budget";
  savings: number;
};

export type Plan = {
  meals: ScaledMeal[];
  grocery: GroceryItem[];
  feasibility: FeasibilityResult;
  substitutions: Substitution[];
  totalCost: number;
  message?: string;
};

export const EFFORT_ORDER: EffortLevel[] = ["quick", "medium", "elaborate"];

export function effortAllowed(
  recipeEffort: EffortLevel,
  maxEffort: EffortLevel,
): boolean {
  return EFFORT_ORDER.indexOf(recipeEffort) <= EFFORT_ORDER.indexOf(maxEffort);
}
