/**
 * VYOMIK — Launch Configuration
 * 
 * Centralised configuration file for the first collection drop countdown.
 * All countdown timers calculate remaining time from `LAUNCH_DATE_ISO`.
 */

// Target drop date: 12 days, 18 hours, 37 minutes, 24 seconds from the reference baseline
export const LAUNCH_DATE_ISO = '2026-12-02T14:21:43Z';

export interface CountdownValues {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
  totalSeconds: number;
}

/**
 * Calculates days, hours, minutes, seconds remaining from target date.
 */
export function getCountdownValues(targetDateIso: string = LAUNCH_DATE_ISO): CountdownValues {
  const targetMs = new Date(targetDateIso).getTime();
  const nowMs = Date.now();
  const diffMs = targetMs - nowMs;

  if (diffMs <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      isExpired: true,
      totalSeconds: 0,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    isExpired: false,
    totalSeconds,
  };
}
