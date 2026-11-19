import React, { useState, useEffect, useRef } from 'react';
import { useLaunchGate } from '../../hooks/useLaunchGate';
import { useServerClock } from '../../hooks/useServerClock';
import { CountdownTile } from './CountdownTile';

export const ComingSoonCountdown: React.FC = () => {
  const { launchAtIso, serverTimeIso, isLoading } = useLaunchGate();
  const { trueNow } = useServerClock(serverTimeIso);
  const warnedPastRef = useRef(false);
  const warnedUnavailableRef = useRef(false);

  const [timeState, setTimeState] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    status: 'active' | 'expired' | 'unavailable';
    label: string;
  }>({
    days: '—',
    hours: '—',
    minutes: '—',
    seconds: '—',
    status: 'unavailable',
    label: 'LAUNCH DATE ANNOUNCING SOON',
  });

  useEffect(() => {
    if (isLoading && !launchAtIso) {
      return;
    }

    if (!launchAtIso) {
      if (!warnedUnavailableRef.current) {
        console.warn(
          '[VYOMIK Config] Backend configuration unavailable. Countdown suspended until server connects.'
        );
        warnedUnavailableRef.current = true;
      }
      setTimeState({
        days: '—',
        hours: '—',
        minutes: '—',
        seconds: '—',
        status: 'unavailable',
        label: 'LAUNCH DATE ANNOUNCING SOON',
      });
      return;
    }

    const targetMs = new Date(launchAtIso).getTime();
    if (isNaN(targetMs)) {
      setTimeState({
        days: '—',
        hours: '—',
        minutes: '—',
        seconds: '—',
        status: 'unavailable',
        label: 'LAUNCH DATE ANNOUNCING SOON',
      });
      return;
    }

    const diff = targetMs - trueNow;

    if (diff <= 0) {
      if (!warnedPastRef.current) {
        console.warn(
          `[VYOMIK Config] Backend launch_at (${launchAtIso}) is in the past. Update LAUNCH_AT in backend/.env`
        );
        warnedPastRef.current = true;
      }
      setTimeState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        status: 'expired',
        label: 'DOORS OPENING SOON',
      });
      return;
    }

    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    setTimeState({
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      status: 'active',
      label: 'THE FIRST DROP IN',
    });
  }, [launchAtIso, trueNow, isLoading]);

  return (
    <div className="flex flex-col items-start gap-3 z-20 relative" data-testid="countdown-container">
      {/* Dynamic Status / Header Label */}
      <div className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-[#716B63] tracking-[0.3em] font-montserrat uppercase">
        {timeState.label}
      </div>

      {/* 4 Dedicated Minimal Countdown Tiles */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4" data-testid="countdown-tiles">
        <CountdownTile value={timeState.days} label="DAYS" />
        <CountdownTile value={timeState.hours} label="HOURS" />
        <CountdownTile value={timeState.minutes} label="MINUTES" />
        <CountdownTile value={timeState.seconds} label="SECONDS" />
      </div>
    </div>
  );
};
