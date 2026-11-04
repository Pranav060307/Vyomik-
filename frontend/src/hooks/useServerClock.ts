import { useState, useEffect, useRef } from 'react';

/**
 * Hook to synchronize client-side time with server time.
 * Calculates clock offset on load so device clock tampering or inaccuracies
 * do not impact the live countdown or gate status.
 */
export function useServerClock(serverTimeIso?: string) {
  // Offset in milliseconds: serverTime - clientLocalTime
  const offsetRef = useRef<number>(0);

  // Compute offset whenever serverTimeIso changes
  useEffect(() => {
    if (serverTimeIso) {
      try {
        const serverMs = new Date(serverTimeIso).getTime();
        const clientMs = Date.now();
        if (!isNaN(serverMs)) {
          offsetRef.current = serverMs - clientMs;
        }
      } catch (err) {
        console.warn('Failed to parse server time, using local clock:', err);
      }
    }
  }, [serverTimeIso]);

  // Current true time in milliseconds
  const [trueNow, setTrueNow] = useState<number>(() => Date.now() + offsetRef.current);

  useEffect(() => {
    // Tick every 1000ms
    const interval = setInterval(() => {
      setTrueNow(Date.now() + offsetRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTrueNow = () => Date.now() + offsetRef.current;

  return {
    trueNow,
    getTrueNow,
    clockOffset: offsetRef.current,
  };
}
