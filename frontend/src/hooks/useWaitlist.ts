import { useMutation } from '@tanstack/react-query';
import { WaitlistPayload, WaitlistResponse } from '../types/store';

export function useWaitlist() {
  return useMutation<WaitlistResponse, Error, WaitlistPayload>({
    mutationFn: async ({ email, source }) => {
      const endpoints = [
        import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/waitlist` : null,
        'http://localhost:8000/api/v1/waitlist',
        '/api/v1/waitlist',
        '/api/waitlist',
      ].filter(Boolean) as string[];

      // Unique deduplicated endpoints to try in order
      const uniqueEndpoints = Array.from(new Set(endpoints));

      let lastError: Error | null = null;
      for (const url of uniqueEndpoints) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, source }),
          });

          if (!res.ok) {
            let errorMsg = 'Failed to join waitlist. Please try again.';
            try {
              const errData = await res.json();
              if (errData.detail) {
                errorMsg = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
              }
            } catch {
              // fallback
            }
            throw new Error(errorMsg);
          }

          return await res.json();
        } catch (err: any) {
          lastError = err;
          // Continue to next endpoint if network or fetch failed
        }
      }

      throw lastError || new Error('Network error. Failed to join waitlist.');
    },
  });
}
