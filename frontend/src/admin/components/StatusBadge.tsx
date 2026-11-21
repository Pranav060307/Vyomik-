import React from 'react';

export type BadgeVariant =
  | 'paid'
  | 'pending'
  | 'failed'
  | 'refunded'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'in_stock'
  | 'out_of_stock'
  | 'low_stock'
  | 'healthy'
  | 'degraded'
  | 'offline'
  | 'synced'
  | 'local';

interface StatusBadgeProps {
  status: string | BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const normalized = String(status).toLowerCase().replace(/[\s-]/g, '_') as BadgeVariant;
  const displayLabel = label || status.replace(/_/g, ' ').toUpperCase();

  const getStyle = (): { bg: string; text: string; dot: string; border: string } => {
    switch (normalized) {
      case 'paid':
      case 'delivered':
      case 'in_stock':
      case 'healthy':
      case 'synced':
        return {
          bg: 'bg-[#162116]',
          text: 'text-[#86C286]',
          dot: 'bg-[#86C286]',
          border: 'border-[#233823]',
        };
      case 'pending':
      case 'processing':
      case 'confirmed':
      case 'low_stock':
      case 'degraded':
        return {
          bg: 'bg-[#241D13]',
          text: 'text-[#D9A757]',
          dot: 'bg-[#D9A757]',
          border: 'border-[#3D301E]',
        };
      case 'dispatched':
        return {
          bg: 'bg-[#1B2124]',
          text: 'text-[#8CB4C4]',
          dot: 'bg-[#8CB4C4]',
          border: 'border-[#2C3840]',
        };
      case 'failed':
      case 'cancelled':
      case 'refunded':
      case 'out_of_stock':
      case 'offline':
        return {
          bg: 'bg-[#241416]',
          text: 'text-[#D47984]',
          dot: 'bg-[#D47984]',
          border: 'border-[#3D2024]',
        };
      case 'local':
        return {
          bg: 'bg-[#181615]',
          text: 'text-[#A8A29E]',
          dot: 'bg-[#716B63]',
          border: 'border-[#292623]',
        };
      default:
        return {
          bg: 'bg-[#171514]',
          text: 'text-[#D9D1C3]',
          dot: 'bg-[#C85A2E]',
          border: 'border-[#2E2B27]',
        };
    }
  };

  const style = getStyle();
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-montserrat font-semibold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {displayLabel}
    </span>
  );
};
