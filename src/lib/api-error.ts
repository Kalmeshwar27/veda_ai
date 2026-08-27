export function classifyError(error: unknown): { status: number; message: string } {
  const raw = error instanceof Error ? error.message : String(error);

  if (raw.includes("RESOURCE_EXHAUSTED") || raw.includes("429")) {
    if (raw.includes("PerDay")) {
      return {
        status: 429,
        message:
          "The AI service has reached its daily usage limit. Please try again tomorrow.",
      };
    }
    return {
      status: 429,
      message:
        "The AI service is receiving too many requests right now. Please wait a minute and try again.",
    };
  }

  if (
    raw.toLowerCase().includes("api key") ||
    raw.toLowerCase().includes("permission") ||
    raw.includes("401") ||
    raw.includes("403")
  ) {
    return {
      status: 500,
      message:
        "There was a configuration issue connecting to the AI service. Please try again shortly.",
    };
  }

  if (
    raw.includes("failed validation") ||
    raw.includes("did not return valid JSON")
  ) {
    return {
      status: 502,
      message:
        "We couldn't clearly read one of the uploaded documents. Please try a clearer scan or a different file.",
    };
  }

  if (
    raw.toLowerCase().includes("fetch failed") ||
    raw.toLowerCase().includes("network") ||
    raw.toLowerCase().includes("timeout")
  ) {
    return {
      status: 504,
      message:
        "The request took too long or the connection was interrupted. Please try again.",
    };
  }

  if (raw.includes("Missing question paper or answer sheet")) {
    return {
      status: 400,
      message: raw,
    };
  }

  return {
    status: 500,
    message: "Something went wrong while processing your documents. Please try again.",
  };
}