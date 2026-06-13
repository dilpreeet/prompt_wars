import { NextRequest, NextResponse } from "next/server";
import { enhanceWithGemini, isGeminiConfigured } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateEnhanceRequest } from "@/lib/validation";

const MAX_BODY_BYTES = 8192;

export async function GET() {
  return NextResponse.json({ available: isGeminiConfigured() });
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: rateLimit.retryAfterSeconds
          ? { "Retry-After": String(rateLimit.retryAfterSeconds) }
          : undefined,
      },
    );
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json(
      {
        error: "AI enhancement is not configured on this server.",
        available: false,
      },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = validateEnhanceRequest(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request payload",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  try {
    const tips = await enhanceWithGemini(
      parsed.data.planSummary,
      parsed.data.question,
    );

    return NextResponse.json({ tips, available: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate AI suggestions. Please try again." },
      { status: 502 },
    );
  }
}
