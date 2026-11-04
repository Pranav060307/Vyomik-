import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStoreConfig } from './useStoreConfig';
import { useServerClock } from './useServerClock';

const EXPLORE_SESSION_KEY = 'vyomik_explore_passed';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function readSessionBypass(): boolean {
  try {
    return sessionStorage.getItem(EXPLORE_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeSessionBypass(): void {
  try {
    sessionStorage.setItem(EXPLORE_SESSION_KEY, 'true');
  } catch (err) {
    console.warn('sessionStorage is unavailable or restricted:', err);
  }
}

export function useLaunchGate() {
  const { data: config, isLoading } = useStoreConfig();
  const { trueNow } = useServerClock(config?.server_time);
  const [sessionBypassed, setSessionBypassed] = useState<boolean>(readSessionBypass);
  const [isPreviewVerifying, setIsPreviewVerifying] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Team Preview Bypass Verification via backend (?preview=<key>)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const previewKey = searchParams.get('preview');

    if (previewKey && !sessionBypassed) {
      setIsPreviewVerifying(true);
      fetch(`${API_BASE_URL}/api/v1/preview/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: previewKey }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.valid) {
            writeSessionBypass();
            setSessionBypassed(true);
          }
        })
        .catch((err) => {
          console.error('Preview key verification failed:', err);
        })
        .finally(() => {
          setIsPreviewVerifying(false);
        });
    }
  }, [location.search, sessionBypassed]);

  // 2. Compute whether launch time has arrived using true server time
  const launchAtMs = config?.launch_at ? new Date(config.launch_at).getTime() : 0;
  const isTimePassed = launchAtMs > 0 ? trueNow >= launchAtMs : false;

  // 3. Final gate evaluation:
  // Active if: gate_enabled is true, not bypassed by session, not bypassed by preview, and not passed launch time
  const isGateActive = Boolean(
    config?.gate_enabled && !sessionBypassed && !isTimePassed
  );

  // 4. Explore action: sets session flag and navigates to /home
  const onExplore = useCallback(() => {
    writeSessionBypass();
    setSessionBypassed(true);
    navigate('/home');
  }, [navigate]);

  return {
    isGateActive,
    isTimePassed,
    sessionBypassed,
    isPreviewVerifying,
    isLoading,
    onExplore,
    launchAtIso: config?.launch_at,
    serverTimeIso: config?.server_time,
  };
}
