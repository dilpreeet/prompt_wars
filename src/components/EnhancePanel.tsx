"use client";

import { useEffect, useState } from "react";
import { buildPlanSummary } from "@/lib/plan-summary";
import type { Plan, PlanInput } from "@/lib/types";

type EnhancePanelProps = {
  plan: Plan;
  input: PlanInput;
};

type EnhanceResponse = {
  tips?: string;
  available?: boolean;
  error?: string;
  issues?: string[];
};

export function EnhancePanel({ plan, input }: EnhancePanelProps) {
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [tips, setTips] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    async function checkAvailability() {
      try {
        const response = await fetch("/api/enhance");
        if (!response.ok) {
          setAiAvailable(false);
          return;
        }

        const data = (await response.json()) as EnhanceResponse;
        setAiAvailable(Boolean(data.available));
      } catch {
        setAiAvailable(false);
      }
    }

    checkAvailability();
  }, []);

  async function handleEnhance() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSummary: buildPlanSummary(plan, input),
          question: question.trim() || undefined,
        }),
      });

      const data = (await response.json()) as EnhanceResponse;

      if (!response.ok) {
        setError(data.error ?? "Could not enhance plan.");
        if (response.status === 503) {
          setAiAvailable(false);
        }
        return;
      }

      setTips(data.tips ?? null);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (aiAvailable === null) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-stone-500">Checking AI availability…</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="enhance-heading"
      className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm"
    >
      <h2 id="enhance-heading" className="text-lg font-semibold text-violet-950">
        Enhance with AI
      </h2>
      <p className="mt-1 text-sm text-violet-900/80">
        Get extra prep tips and budget ideas powered by Google Gemini (free tier).
      </p>

      {!aiAvailable ? (
        <p className="mt-4 rounded-xl bg-white/80 px-4 py-3 text-sm text-stone-600">
          AI enhancement is unavailable. Add{" "}
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">
            GEMINI_API_KEY
          </code>{" "}
          to your server environment to enable this feature. The app works fully
          without it.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="enhance-question"
              className="block text-sm font-medium text-violet-950"
            >
              Optional question (leave blank for general tips)
            </label>
            <input
              id="enhance-question"
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. How can I prep everything in under 30 minutes?"
              maxLength={500}
              className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <button
            type="button"
            onClick={handleEnhance}
            disabled={isLoading}
            aria-busy={isLoading}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Getting AI tips…" : "Enhance with AI"}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-rose-700">
          {error}
        </p>
      )}

      {tips && (
        <div
          aria-live="polite"
          className="mt-4 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm leading-relaxed text-stone-800 whitespace-pre-wrap"
        >
          {tips}
        </div>
      )}
    </section>
  );
}
