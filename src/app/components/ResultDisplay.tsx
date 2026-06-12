"use client";

import CopyButton from "./CopyButton";

interface ResultDisplayProps {
  translatedImage: string;
  douyinCaption: string;
}

export default function ResultDisplay({
  translatedImage,
  douyinCaption,
}: ResultDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = translatedImage;
    link.download = "translated-image.png";
    link.click();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Translated Image */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Translated Image</h2>
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={translatedImage}
            alt="Translated screenshot"
            className="w-full h-auto"
          />
        </div>
        <button
          onClick={handleDownload}
          className="self-start px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Download Image
        </button>
      </div>

      {/* Douyin Caption */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Douyin Caption</h2>
        <div className="bg-gray-50 border rounded-xl p-6">
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
            {douyinCaption}
          </p>
        </div>
        <CopyButton text={douyinCaption} label="Copy Caption" />
      </div>
    </div>
  );
}
