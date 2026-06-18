"use client";

import { useState, useCallback } from "react";
import UploadZone from "./components/UploadZone";
import ResultDisplay from "./components/ResultDisplay";
import ApiKeyInput from "./components/ApiKeyInput";
import PromptEditor from "./components/PromptEditor";
import ContentSettings from "./components/ContentSettings";
import { imageTranslationPrompt as defaultTranslationPrompt, douyinContentPrompt as defaultCaptionPrompt } from "@/lib/prompts";

interface ProcessResult {
  translatedImage: string;
  douyinCaption: string;
}

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // States for custom prompts
  const [translationPrompt, setTranslationPrompt] = useState(defaultTranslationPrompt);
  const [captionPrompt, setCaptionPrompt] = useState(defaultCaptionPrompt);
  
  // States for content settings
  const [platform, setPlatform] = useState("Douyin / TikTok");
  const [tone, setTone] = useState("Engaging & Viral");

  const handleKeyChange = useCallback((key: string | null) => {
    setApiKey(key);
  }, []);

  const handleFileSelect = async (file: File) => {
    if (!apiKey) {
      setError("Please configure and validate your API key in the panel below first.");
      return;
    }

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
      formData.append("apiKey", apiKey);
      formData.append("translationPrompt", translationPrompt);
      formData.append("captionPrompt", captionPrompt);
      formData.append("platform", platform);
      formData.append("tone", tone);

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        <header className="text-center mb-4">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-wider uppercase shadow-sm">
            AI Powered
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 tracking-tight">
            Douyin Content Generator
          </h1>
          <p className="text-gray-500 mt-3 text-lg font-medium">
            Upload a screenshot — get a translated image + ready-to-post Douyin caption
          </p>
        </header>

        {/* 1. Generator Frame */}
        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-xl shadow-indigo-100/50 border border-white">
          <UploadZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />

          {/* Original image preview */}
          {preview && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Original Screenshot
              </h2>
              <div className="border rounded-xl overflow-hidden bg-gray-50 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <div className="mt-8 pt-8 border-t border-gray-100">
              <ResultDisplay
                translatedImage={result.translatedImage}
                douyinCaption={result.douyinCaption}
              />
            </div>
          )}
        </div>

        {/* 2. API Configuration Frame */}
        <div className="w-full">
          <ApiKeyInput onKeyChange={handleKeyChange} />
        </div>

        {/* 3. Content Preferences */}
        <ContentSettings 
          platform={platform} 
          setPlatform={setPlatform} 
          tone={tone} 
          setTone={setTone} 
        />

        {/* 4. Prompt Configuration Frames */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <PromptEditor 
            title="Image Translation Prompt" 
            value={translationPrompt} 
            onChange={setTranslationPrompt} 
          />
          <PromptEditor 
            title="Douyin Caption Prompt" 
            value={captionPrompt} 
            onChange={setCaptionPrompt} 
          />
        </div>

      </div>
    </div>
  );
}
