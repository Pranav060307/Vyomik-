import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  icon?: React.ElementType;
  accent?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  delta,
  subtitle,
  icon: Icon,
  accent = false,
}) => {
  return (
    <div
      className={`bg-[#141414] rounded-2xl p-6 border transition-all ${
        accent
          ? 'border-[#C85A2E]/50'
          : 'border-[#242321] hover:border-[#38342E]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-[#0B0B0B] border border-[#242321] text-[#C85A2E]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-3 mb-1.5">
        <div className="text-2xl sm:text-3xl font-bold font-montserrat text-[#F4F0E8] tracking-tight">
          {value}
        </div>
        {delta && (
          <div
            className={`inline-flex items-center text-xs font-semibold ${
              delta.isPositive ? 'text-[#86C286]' : 'text-[#D47984]'
            }`}
          >
            {delta.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {delta.value}
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-[#716B63] leading-relaxed">{subtitle}</p>}
    </div>
  );
};
