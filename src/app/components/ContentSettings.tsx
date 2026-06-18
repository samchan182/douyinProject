"use client";

interface ContentSettingsProps {
  platform: string;
  setPlatform: (platform: string) => void;
  tone: string;
  setTone: (tone: string) => void;
}

export default function ContentSettings({ platform, setPlatform, tone, setTone }: ContentSettingsProps) {
  const platforms = ["Douyin / TikTok", "Xiaohongshu (RED)", "Kuaishou", "WeChat Video", "Bilibili"];
  const tones = ["Engaging & Viral", "Professional & Informative", "Humorous & Meme-style", "Emotional & Storytelling", "Direct & Sales-oriented"];

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-indigo-100/30 border border-white mt-6">
      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500 mb-4">Content Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Target Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full text-gray-900 bg-white text-sm px-4 py-3 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-shadow shadow-sm appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
          >
            {platforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Tone Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Caption Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full text-gray-900 bg-white text-sm px-4 py-3 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-shadow shadow-sm appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
          >
            {tones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
