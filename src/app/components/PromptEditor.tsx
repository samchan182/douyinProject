"use client";

import { useState } from "react";

interface PromptEditorProps {
  title: string;
  defaultText: string;
  onConfirm: (text: string) => void;
  onLockChange?: (isLocked: boolean) => void;
}

export default function PromptEditor({ title, defaultText, onConfirm, onLockChange }: PromptEditorProps) {
  const [text, setText] = useState(defaultText);
  const [isLocked, setIsLocked] = useState(false);

  const handleConfirm = () => {
    setIsLocked(true);
    onConfirm(text);
    if (onLockChange) onLockChange(true);
  };

  const handleUndo = () => {
    setIsLocked(false);
    if (onLockChange) onLockChange(false);
  };

  return (
    <div className={`p-5 rounded-xl border transition-all duration-300 ${isLocked ? 'bg-gray-50 border-gray-200 shadow-none' : 'bg-white border-blue-200 shadow-sm'}`}>
      <h3 className={`text-sm font-semibold mb-3 ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>
        {title}
      </h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLocked}
        className={`w-full h-72 p-4 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors ${
          isLocked 
            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-900 border-gray-300'
        }`}
      />
      <div className="mt-4 flex justify-end h-10">
        {isLocked ? (
          <button
            onClick={handleUndo}
            className="px-5 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Edit / Undo
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
}
