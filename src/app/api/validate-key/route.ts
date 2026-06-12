import { NextRequest } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return Response.json({ error: "No API key provided" }, { status: 400 });
    }

    // A 1x1 transparent PNG base64 to test vision capabilities
    const dummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    await callGemini([
      { inlineData: { mimeType: "image/png", data: dummyImage } },
      { text: "Describe this image in one word. It is a 1x1 transparent image." }
    ], apiKey);

    return Response.json({ valid: true });
  } catch (error) {
    console.error("Validation error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Validation failed" },
      { status: 400 }
    );
  }
}
