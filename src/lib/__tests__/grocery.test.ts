import { describe, expect, it } from "vitest";
import { aggregateGroceryList } from "../grocery";
import { scaleRecipe } from "../scale";
import { getRecipeById } from "../recipes";

describe("grocery", () => {
  it("merges the same ingredient across meals into one line with summed qty", () => {
    const stirFry = getRecipeById("dn-stirfry");
    const curry = getRecipeById("dn-curry");
    expect(stirFry).toBeDefined();
    expect(curry).toBeDefined();

    const meals = [
      scaleRecipe(stirFry!, 2),
      scaleRecipe(curry!, 2),
    ];

    const grocery = aggregateGroceryList(meals);
    const rice = grocery.find((item) => item.item === "rice");

    expect(rice).toBeDefined();
    expect(rice!.qty).toBe(3);
    expect(rice!.cost).toBe(2);
    expect(grocery.filter((item) => item.item === "rice")).toHaveLength(1);
  });
});
