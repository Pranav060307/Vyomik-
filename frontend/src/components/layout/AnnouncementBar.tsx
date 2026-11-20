import React from 'react';
import { useStoreConfig } from '../../hooks/useStoreConfig';

function formatLaunchDate(isoString?: string): string {
  if (!isoString) return '10.11.2026';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '10.11.2026';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return '10.11.2026';
  }
}

export const AnnouncementBar: React.FC = () => {
  const { data: config } = useStoreConfig();
  const dateStr = formatLaunchDate(config?.launch_at);

  return (
    <div className="bg-[#C85A2E] text-white py-2 px-4 text-center text-[11px] font-bold tracking-[0.2em] uppercase select-none border-b border-[#A64B2A]/40">
      THE FIRST DROP · COMING SOON · {dateStr}
    </div>
  );
};
