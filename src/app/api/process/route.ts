import { NextRequest } from "next/server";
import { callGemini } from "@/lib/gemini";
import { imageTranslationPrompt, douyinContentPrompt } from "@/lib/prompts";
import { processImage } from "@/lib/image-processor";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

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

    // Run both Gemini calls in parallel
    const [translationText, douyinCaption] = await Promise.all([
      callGemini([imagePart, { text: imageTranslationPrompt }]),
      callGemini([imagePart, { text: douyinContentPrompt }]),
    ]);

    // Parse translation JSON
    const jsonMatch = translationText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cleanJson = jsonMatch ? jsonMatch[1].trim() : translationText.trim();

    let translationData;
    try {
      translationData = JSON.parse(cleanJson);
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
    return Response.json(
      { error: error instanceof Error ? error.message : "Processing failed" },
      { status: 500 }
    );
  }
}
