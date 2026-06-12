import { ProxyAgent, fetch as undiciFetch } from "undici";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "http://127.0.0.1:7897";
const proxyAgent = new ProxyAgent(proxyUrl);
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

export async function callGemini(parts: GeminiPart[], customApiKey?: string): Promise<string> {
  const activeApiKey = customApiKey || apiKey;
  
  if (!activeApiKey) {
    throw new Error("API key is not set. Please provide a valid Gemini API key.");
  }

  const url = `${BASE_URL}/models/${MODEL}:generateContent?key=${activeApiKey}`;

  const response = await undiciFetch(url, {
    method: "POST",
    dispatcher: proxyAgent,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
    }),
  });

  const responseText = await response.text();
  let data: GeminiResponse;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Failed to parse Gemini API response. Status: ${response.status}, Body: ${responseText.substring(0, 100)}...`);
  }

  if (!response.ok || data.error) {
    const errorCode = data.error?.code || response.status;
    const errorMessage = data.error?.message || responseText;
    throw new Error(`Gemini API error (${errorCode}): ${errorMessage}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return text;
}
