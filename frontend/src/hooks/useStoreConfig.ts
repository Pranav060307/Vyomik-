import { useQuery } from '@tanstack/react-query';
import { StoreConfig } from '../types/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const DEFAULT_CONFIG: StoreConfig = {
  store_name: 'VYOMIK',
  store_mode: 'coming_soon',
  launch_date: '2026-11-08',
  payment_provider: 'mock',
  cod_available: true,
  free_shipping_threshold_paise: 149900,
  default_shipping_fee_paise: 9900,
  cod_fee_paise: 4900,
  demo_content: true,
};

export function useStoreConfig() {
  return useQuery<StoreConfig>({
    queryKey: ['storeConfig'],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/config`);
        if (!res.ok) {
          throw new Error(`Failed to load store configuration (${res.status})`);
        }
        return await res.json();
      } catch (err) {
        console.warn('Backend config unavailable, falling back to client defaults:', err);
        return DEFAULT_CONFIG;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData: DEFAULT_CONFIG,
  });
}
