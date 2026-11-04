import React, { useState, useEffect, useRef } from 'react';
import { useServerClock } from '../hooks/useServerClock';

interface CountdownProps {
  targetIso?: string;
  serverTimeIso?: string;
  onZero?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isZero: boolean;
}

function calculateRemaining(targetMs: number, currentMs: number): TimeRemaining {
  const diff = targetMs - currentMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isZero: true };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, totalMs: diff, isZero: false };
}

export const Countdown: React.FC<CountdownProps> = ({
  targetIso,
  serverTimeIso,
  onZero,
}) => {
  const { trueNow } = useServerClock(serverTimeIso);
  const targetMs = targetIso ? new Date(targetIso).getTime() : 0;
  const onZeroTriggeredRef = useRef(false);

  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    calculateRemaining(targetMs, trueNow)
  );

  // Accessible live announcer state: updated only every 60 seconds (low frequency)
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string>('');

  useEffect(() => {
    const next = calculateRemaining(targetMs, trueNow);
    setRemaining(next);

    if (next.isZero && !onZeroTriggeredRef.current) {
      onZeroTriggeredRef.current = true;
      if (onZero) onZero();
    }
  }, [trueNow, targetMs, onZero]);

  // Update aria-live polite announcement every minute, not every second
  useEffect(() => {
    if (remaining.isZero) {
      setAriaAnnouncement("The launch countdown has completed. We're live.");
    } else {
      setAriaAnnouncement(
        `Launch countdown: ${remaining.days} days, ${remaining.hours} hours, and ${remaining.minutes} minutes remaining.`
      );
    }
  }, [remaining.days, remaining.hours, remaining.minutes, remaining.isZero]);

  if (remaining.isZero) {
    return (
      <div
        data-testid="countdown-live"
        className="py-4 px-6 bg-white border border-[#5C6548] inline-flex items-center space-x-3 transition-all duration-500 animate-fadeIn"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#5C6548] animate-ping" />
        <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
          We're live
        </span>
      </div>
    );
  }

  const tiles = [
    { label: 'DAYS', value: String(remaining.days).padStart(2, '0') },
    { label: 'HOURS', value: String(remaining.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(remaining.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(remaining.seconds).padStart(2, '0') },
  ];

  return (
    <div className="w-full max-w-lg">
      {/* Screen reader low-frequency live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </div>

      {/* 4 Minimal Tiles with stone dividers and tabular figures */}
      <div
        data-testid="countdown-tiles"
        className="grid grid-cols-4 border border-[#DAD7CE] bg-white divide-x divide-[#DAD7CE]"
      >
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col items-center justify-center py-4 sm:py-5 px-2"
          >
            <span className="text-2xl sm:text-4xl font-semibold text-[#202020] [font-variant-numeric:tabular-nums] tracking-tight">
              {tile.value}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5C6548] mt-1">
              {tile.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

