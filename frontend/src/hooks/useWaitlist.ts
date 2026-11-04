import { useMutation } from '@tanstack/react-query';
import { WaitlistPayload, WaitlistResponse } from '../types/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function useWaitlist() {
  return useMutation<WaitlistResponse, Error, WaitlistPayload>({
    mutationFn: async ({ email, source }) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/waitlist`, {
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
    },
  });
}

