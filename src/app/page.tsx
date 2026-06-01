"use client";

import { useState } from "react";
import UploadZone from "./components/UploadZone";
import ResultDisplay from "./components/ResultDisplay";

interface ProcessResult {
  translatedImage: string;
  douyinCaption: string;
}

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    // Show preview of original image
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Processing failed");
      }

      setResult({
        translatedImage: data.translatedImage,
        douyinCaption: data.douyinCaption,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Douyin Content Generator
          </h1>
          <p className="text-gray-500 mt-2">
            Upload a screenshot — get a translated image + ready-to-post Douyin
            caption
          </p>
        </header>

        <UploadZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />

        {/* Original image preview */}
        {preview && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Original Screenshot
            </h2>
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
              <img src={preview} alt="Original screenshot" className="w-full h-auto" />
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8">
            <ResultDisplay
              translatedImage={result.translatedImage}
              douyinCaption={result.douyinCaption}
            />
          </div>
        )}
      </div>
    </div>
  );
}
