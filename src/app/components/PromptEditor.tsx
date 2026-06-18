"use client";

interface PromptEditorProps {
  title: string;
  value: string;
  onChange: (text: string) => void;
}

export default function PromptEditor({ title, value, onChange }: PromptEditorProps) {
  return (
    <div className="p-5 rounded-xl border bg-white border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">
        {title}
      </h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-72 p-4 text-sm rounded-lg border bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
      />
    </div>
  );
}
