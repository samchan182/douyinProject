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
    <div className="flex flex-col gap-10">
      {/* Translated Image */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-indigo-900 tracking-tight">Translated Image</h2>
        <div className="border border-indigo-100/50 rounded-2xl overflow-hidden bg-white shadow-xl shadow-indigo-100/50 ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={translatedImage}
            alt="Translated screenshot"
            className="w-full h-auto"
          />
        </div>
        <button
          onClick={handleDownload}
          className="self-start px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all shadow-md shadow-emerald-200 text-sm font-bold transform active:scale-[0.98]"
        >
          Download Image
        </button>
      </div>

      {/* Douyin Caption */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-indigo-900 tracking-tight">Douyin Caption</h2>
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 shadow-inner">
          <p className="text-indigo-950 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {douyinCaption}
          </p>
        </div>
        <CopyButton text={douyinCaption} label="Copy Caption" />
      </div>
    </div>
  );
}
