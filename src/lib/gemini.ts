import { ProxyAgent, fetch as undiciFetch } from "undici";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const proxyAgent = new ProxyAgent("http://127.0.0.1:7897");
const MODEL = "gemini-2.5-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
  error?: { code: number; message: string };
}

export async function callGemini(parts: GeminiPart[]): Promise<string> {
  const url = `${BASE_URL}/models/${MODEL}:generateContent?key=${apiKey}`;

  const response = await undiciFetch(url, {
    method: "POST",
    dispatcher: proxyAgent,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
    }),
  });

  const data = (await response.json()) as GeminiResponse;

  if (data.error) {
    throw new Error(`Gemini API error (${data.error.code}): ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return text;
}
