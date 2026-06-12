"use client";

import { useState, useEffect } from "react";

interface ApiKeyInputProps {
  onKeyChange: (key: string | null) => void;
}

export default function ApiKeyInput({ onKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("gemini_api_key");
    if (stored) {
      // Defer state update to avoid synchronous cascading render warning
      setTimeout(() => {
        setApiKey(stored);
        onKeyChange(stored);
        setStatus("valid");
      }, 0);
    }
  }, [onKeyChange]);

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setStatus("invalid");
      setErrorMsg("Please enter an API key");
      onKeyChange(null);
      localStorage.removeItem("gemini_api_key");
      return;
    }

    setStatus("validating");
    setErrorMsg("");

    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setStatus("valid");
        localStorage.setItem("gemini_api_key", apiKey);
        onKeyChange(apiKey);
      } else {
        setStatus("invalid");
        setErrorMsg(data.error || "Invalid API key or model lacks vision capabilities.");
        localStorage.removeItem("gemini_api_key");
        onKeyChange(null);
      }
    } catch {
      setStatus("invalid");
      setErrorMsg("Failed to validate API key. Please check your network.");
      localStorage.removeItem("gemini_api_key");
      onKeyChange(null);
    }
  };

  return (
    <div className="w-full bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-2">API Configuration</h3>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        Please upload your API key. Ensure the associated model supports image editing (vision capabilities).
      </p>
      <div className="flex flex-col gap-3">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            if (status === "valid" || status === "invalid") {
              setStatus("idle");
            }
          }}
          placeholder="Enter API Key (AIzaSy...)"
          className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-shadow"
        />
        <button
          onClick={handleValidate}
          disabled={status === "validating" || !apiKey.trim()}
          className="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {status === "validating" ? "Validating Key..." : "Test & Save Key"}
        </button>
      </div>
      
      {status === "valid" && (
        <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded-lg">
          <p className="text-xs text-green-700 flex items-center gap-1.5 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            API Key validated successfully
          </p>
        </div>
      )}
      
      {status === "invalid" && (
        <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-xs text-red-600 font-medium break-words leading-relaxed">
            {errorMsg}
          </p>
        </div>
      )}
    </div>
  );
}
