const DEFAULT_MODEL = "gemini-2.0-flash";

function getApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY?.trim();
}

function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export function isGeminiConfigured(): boolean {
  return Boolean(getApiKey());
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function enhanceWithGemini(
  planSummary: string,
  question?: string,
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const userPrompt = question
    ? `${question}\n\nMeal plan context:\n${planSummary}`
    : `Review this meal plan and provide 3-5 concise, practical tips. Focus on prep order, budget savings, ingredient swaps, or time-saving ideas. Keep each tip to one sentence.\n\nMeal plan:\n${planSummary}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${getModel()}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as GeminiResponse;

  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}
