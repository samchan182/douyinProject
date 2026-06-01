"use client";

import { useCallback } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function UploadZone({
  onFileSelect,
  isProcessing,
}: UploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelect(file);
      }
    };
    input.click();
  }, [onFileSelect]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={isProcessing ? undefined : handleClick}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
        isProcessing
          ? "border-gray-300 bg-gray-50 cursor-not-allowed"
          : "border-gray-400 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
      }`}
    >
      {isProcessing ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-lg">Processing...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-medium">
            Drop screenshot here or click to upload
          </p>
          <p className="text-gray-400 text-sm">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
}
