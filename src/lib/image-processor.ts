import { createCanvas, loadImage } from "canvas";

interface TextBlock {
  original: string;
  translated: string;
  position: {
    x_percent: number;
    y_percent: number;
    width_percent: number;
    height_percent: number;
  };
  style: {
    font_size: string;
    color: string;
    bold: boolean;
    background_color: string;
  };
}

interface Watermark {
  exists: boolean;
  position: {
    x_percent: number;
    y_percent: number;
    width_percent: number;
    height_percent: number;
  };
  background_color: string;
}

interface TranslationData {
  text_blocks: TextBlock[];
  watermark: Watermark;
}

function getFontSize(size: string, blockHeight: number): number {
  switch (size) {
    case "large":
      return Math.max(blockHeight * 0.6, 24);
    case "small":
      return Math.max(blockHeight * 0.4, 12);
    case "medium":
    default:
      return Math.max(blockHeight * 0.5, 16);
  }
}

function wrapText(
  ctx: ReturnType<import("canvas").Canvas["getContext"]>,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  let currentLine = "";

  for (const char of text) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export async function processImage(
  imageBuffer: Buffer,
  translationData: TranslationData
): Promise<Buffer> {
  const img = await loadImage(imageBuffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");

  // Draw original image
  ctx.drawImage(img, 0, 0);

  // Remove watermark if it exists
  if (translationData.watermark?.exists) {
    const wm = translationData.watermark;
    const x = (wm.position.x_percent / 100) * img.width;
    const y = (wm.position.y_percent / 100) * img.height;
    const w = (wm.position.width_percent / 100) * img.width;
    const h = (wm.position.height_percent / 100) * img.height;

    // Sample background color from surrounding area
    const bgColor = wm.background_color || "#ffffff";
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);
  }

  // Replace text blocks
  for (const block of translationData.text_blocks) {
    const x = (block.position.x_percent / 100) * img.width;
    const y = (block.position.y_percent / 100) * img.height;
    const w = (block.position.width_percent / 100) * img.width;
    const h = (block.position.height_percent / 100) * img.height;

    // Cover original text with background color
    const bgColor = block.style.background_color || "#ffffff";
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);

    // Draw translated text
    const fontSize = getFontSize(block.style.font_size, h);
    const fontWeight = block.style.bold ? "bold" : "normal";
    ctx.font = `${fontWeight} ${fontSize}px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = block.style.color || "#000000";
    ctx.textBaseline = "top";

    const lines = wrapText(ctx, block.translated, w - 8);
    const lineHeight = fontSize * 1.3;
    const totalTextHeight = lines.length * lineHeight;
    const startY = y + (h - totalTextHeight) / 2;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x + 4, startY + i * lineHeight);
    }
  }

  return canvas.toBuffer("image/png");
}
