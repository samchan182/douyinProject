import { NextRequest } from "next/server";
import { callGemini } from "@/lib/gemini";
import { imageTranslationPrompt as defaultTranslationPrompt, douyinContentPrompt as defaultCaptionPrompt } from "@/lib/prompts";
import { processImage } from "@/lib/image-processor";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const apiKey = formData.get("apiKey") as string | null;
    
    const customTranslationPrompt = formData.get("translationPrompt") as string | null;
    const customCaptionPrompt = formData.get("captionPrompt") as string | null;
    const platform = formData.get("platform") as string | null;
    const tone = formData.get("tone") as string | null;

    const finalTranslationPrompt = customTranslationPrompt || defaultTranslationPrompt;
    let finalCaptionPrompt = customCaptionPrompt || defaultCaptionPrompt;

    if (platform || tone) {
      finalCaptionPrompt += `\n\n--- ADDITIONAL REQUIREMENTS ---\n`;
      if (platform) finalCaptionPrompt += `- Target Platform: ${platform} (Adjust formatting, tags, and emojis appropriately for this platform's culture).\n`;
      if (tone) finalCaptionPrompt += `- Tone of Voice: ${tone}.\n`;
    }

    if (!file) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/png";

    const imagePart = {
      inlineData: { mimeType, data: base64Image },
    };

    // Run both Gemini calls in parallel using the finalized prompts
    const [translationText, douyinCaption] = await Promise.all([
      callGemini([imagePart, { text: finalTranslationPrompt }], apiKey || undefined, "application/json"),
      callGemini([imagePart, { text: finalCaptionPrompt }], apiKey || undefined),
    ]);

    let translationData;
    try {
      translationData = JSON.parse(translationText);
    } catch {
      return Response.json(
        { error: "Failed to parse translation response", raw: translationText },
        { status: 500 }
      );
    }

    // Process image: replace text + remove watermark
    const processedImageBuffer = await processImage(buffer, translationData);
    const processedImageBase64 = processedImageBuffer.toString("base64");

    return Response.json({
      translatedImage: `data:image/png;base64,${processedImageBase64}`,
      douyinCaption: douyinCaption.trim(),
      translationData,
    });
  } catch (error) {
    console.error("Processing error:", error);
    let status = 500;
    const message = error instanceof Error ? error.message : "Processing failed";
    
    // Extract status code from Gemini API error format if present
    const statusMatch = message.match(/Gemini API error \((\d+)\)/);
    if (statusMatch && !isNaN(parseInt(statusMatch[1], 10))) {
      status = parseInt(statusMatch[1], 10);
      // Ensure we don't use non-standard HTTP status codes that Next.js might reject
      if (status < 400 || status > 599) status = 500;
    }

    return Response.json(
      { error: message },
      { status }
    );
  }
}
