"use client";

import type { GroceryItem } from "@/lib/types";

type GroceryListProps = {
  items: GroceryItem[];
  onToggle: (id: string) => void;
};

export function GroceryList({ items, onToggle }: GroceryListProps) {
  if (items.length === 0) {
    return null;
  }

  const checkedCount = items.filter((item) => item.checked).length;

  function handlePrint() {
    window.print();
  }

  return (
    <section
      aria-labelledby="grocery-heading"
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm print:border-none print:shadow-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="grocery-heading" className="text-xl font-semibold text-stone-900">
            Grocery to-do list
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            {checkedCount} of {items.length} items checked off
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-xl border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 print:hidden"
        >
          Print / Export
        </button>
      </div>

      <ul className="mt-4 divide-y divide-stone-100">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span
                className={`flex-1 text-sm ${item.checked ? "text-stone-400 line-through" : "text-stone-800"}`}
              >
                {item.qty} {item.unit} {item.item}
              </span>
              <span className="text-sm tabular-nums text-stone-500">
                ${item.cost.toFixed(2)}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
