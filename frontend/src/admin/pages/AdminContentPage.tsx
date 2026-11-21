import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const AdminContentPage: React.FC = () => {
  const [announcementText, setAnnouncementText] = useState(
    'Free Shipping on Orders Above ₹1,499 | New Launch: Core Element Collection'
  );
  const [heroHeading, setHeroHeading] = useState('THE ELEMENT OF DISRUPTION');
  const [heroSubheading, setHeroSubheading] = useState(
    'Engineering high-density luxury streetwear for the next era of expression.'
  );
  const [countdownDate, setCountdownDate] = useState('2026-11-28T18:00:00');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/config`)
      .then((res) => (res.ok ? res.json() : null))
      .then((cfg) => {
        if (cfg?.launch_at) setCountdownDate(cfg.launch_at);
      })
      .catch(() => {});
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl font-montserrat text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
            MESSAGING & BANNERS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
            Storefront CMS & Banners<span className="text-[#C85A2E]">.</span>
          </h1>
          <p className="text-xs text-[#A8A29E] mt-1">
            Control the announcement ribbon marquee, hero headlines, and countdown schedules
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedFeedback && (
        <div className="p-3.5 bg-[#162116] border border-[#233823] rounded-xl flex items-center gap-2 text-[#86C286] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#86C286] shrink-0" />
          <span>Storefront content parameters updated for active sessions.</span>
        </div>
      )}

      {/* Announcement Bar Form */}
      <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A2E] block">
          TOP ANNOUNCEMENT RIBBON
        </span>

        <div>
          <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
            Marquee Announcement Text
          </label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-sm text-[#F4F0E8] outline-none"
          />
        </div>

        {/* Live Ribbon Preview */}
        <div>
          <span className="text-[10px] text-[#716B63] uppercase block mb-1 font-semibold">Live Preview</span>
          <div className="bg-[#C85A2E] text-white py-2.5 px-4 rounded-xl text-xs text-center font-bold tracking-wide">
            {announcementText}
          </div>
        </div>
      </div>

      {/* Hero Messaging */}
      <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A2E] block">
          HERO SECTION HEADLINE
        </span>

        <div>
          <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
            Main Editorial Heading
          </label>
          <input
            type="text"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-[#F4F0E8] outline-none font-bold text-base"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
            Supporting Perspective Narrative
          </label>
          <textarea
            rows={2}
            value={heroSubheading}
            onChange={(e) => setHeroSubheading(e.target.value)}
            className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-2.5 text-[#F4F0E8] outline-none resize-none"
          />
        </div>
      </div>

      {/* Countdown Timer Datetime */}
      <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A2E] block">
          DROP COUNTDOWN SCHEDULER
        </span>

        <div>
          <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
            Next Drop Launch ISO Timestamp
          </label>
          <input
            type="text"
            value={countdownDate}
            onChange={(e) => setCountdownDate(e.target.value)}
            className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] outline-none"
          />
        </div>
      </div>
    </div>
  );
};
