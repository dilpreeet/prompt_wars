import type { Plan, PlanInput } from "./types";

const STORAGE_KEY = "plateplanner:last-plan";
const INPUT_STORAGE_KEY = "plateplanner:last-input";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function savePlan(plan: Plan): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    return true;
  } catch {
    return false;
  }
}

export function loadPlan(): Plan | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as Plan;
  } catch {
    return null;
  }
}

export function savePlanInput(input: PlanInput): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(input));
    return true;
  } catch {
    return false;
  }
}

export function loadPlanInput(): PlanInput | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(INPUT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as PlanInput;
  } catch {
    return null;
  }
}

export function clearStoredPlan(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INPUT_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
