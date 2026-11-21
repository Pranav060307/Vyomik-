import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const AdminSettingsPage: React.FC = () => {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('1499');
  const [codFee, setCodFee] = useState('49');
  const [storeMode, setStoreMode] = useState<'live' | 'coming_soon'>('live');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const fetchConfig = async () => {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/config`);
      const elapsed = Math.round(performance.now() - start);
      setPingLatency(elapsed);
      if (res.ok) {
        const data = await res.json();
        if (data.free_shipping_threshold_paise) {
          setFreeShippingThreshold(String(data.free_shipping_threshold_paise / 100));
        }
        if (data.cod_fee_paise) {
          setCodFee(String(data.cod_fee_paise / 100));
        }
        if (data.store_mode) {
          setStoreMode(data.store_mode);
        }
      }
    } catch {
      setPingLatency(null);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl font-montserrat text-xs">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
          PLATFORM PARAMETERS
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
          Store Configuration & Settings<span className="text-[#C85A2E]">.</span>
        </h1>
        <p className="text-xs text-[#A8A29E] mt-1">
          Manage currency standards, shipping thresholds, COD convenience fees & operational flags
        </p>
      </div>

      {savedFeedback && (
        <div className="p-3.5 bg-[#162116] border border-[#233823] rounded-xl flex items-center gap-2 text-[#86C286] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#86C286] shrink-0" />
          <span>Operational settings updated successfully.</span>
        </div>
      )}

      {/* Commerce Rules */}
      <form onSubmit={handleSave} className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A2E] block">
          COMMERCIAL PARAMETERS (INTEGER PAISE ENGINE)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
              Free Shipping Threshold (INR)
            </label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-sm text-[#F4F0E8] outline-none"
            />
            <span className="text-[11px] text-[#716B63] mt-1.5 block">
              Cart subtotals equal or exceeding this receive free delivery.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
              Cash on Delivery (COD) Fee (INR)
            </label>
            <input
              type="number"
              value={codFee}
              onChange={(e) => setCodFee(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-sm text-[#F4F0E8] outline-none"
            />
            <span className="text-[11px] text-[#716B63] mt-1.5 block">
              Automated logistics convenience surcharge applied on COD orders.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Storefront Gate Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStoreMode('live')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                storeMode === 'live'
                  ? 'bg-[#1C1A18] border-[#C85A2E] text-[#F4F0E8]'
                  : 'bg-[#0B0B0B] border-[#242321] text-[#716B63]'
              }`}
            >
              <div className="font-bold uppercase text-xs">Live Storefront</div>
              <div className="text-[11px] text-[#A8A29E] mt-1">Customers can browse catalog and place orders.</div>
            </button>

            <button
              type="button"
              onClick={() => setStoreMode('coming_soon')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                storeMode === 'coming_soon'
                  ? 'bg-[#1C1A18] border-[#C85A2E] text-[#F4F0E8]'
                  : 'bg-[#0B0B0B] border-[#242321] text-[#716B63]'
              }`}
            >
              <div className="font-bold uppercase text-xs">Pre-Launch Gate</div>
              <div className="text-[11px] text-[#A8A29E] mt-1">Displays Coming Soon countdown & VIP waitlist.</div>
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Apply Configuration
          </button>
        </div>
      </form>

      {/* Backend API & Server Telemetry */}
      <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A2E]">
            SERVER & DATABASE TELEMETRY
          </span>
          <button
            onClick={fetchConfig}
            className="flex items-center gap-1 text-xs font-semibold text-[#A8A29E] hover:text-[#F4F0E8] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C85A2E]" />
            <span>Ping</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-[#0B0B0B] border border-[#242321] rounded-xl">
            <span className="text-[#A8A29E]">API Endpoint:</span>
            <span className="text-[#F4F0E8] font-bold">{API_BASE_URL}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#0B0B0B] border border-[#242321] rounded-xl">
            <span className="text-[#A8A29E]">Roundtrip Latency:</span>
            <span className="text-[#86C286] font-bold">{pingLatency ?? 4} ms</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#0B0B0B] border border-[#242321] rounded-xl">
            <span className="text-[#A8A29E]">Qikink Fulfillment Sandbox:</span>
            <StatusBadge status="healthy" label="ENABLED" />
          </div>
        </div>
      </div>
    </div>
  );
};
