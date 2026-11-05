/**
 * Frontend Store TypeScript Definitions.
 */

export type StoreMode = 'coming_soon' | 'live';

export interface StoreConfig {
  store_name: string;
  store_mode: StoreMode;
  launch_date: string;
  launch_at: string;
  server_time: string;
  gate_enabled: boolean;
  payment_provider: string;
  cod_available: boolean;
  free_shipping_threshold_paise: number;
  default_shipping_fee_paise: number;
  cod_fee_paise: number;
  demo_content: boolean;
  contact_email: string;
  instagram_url: string;
}

export interface WaitlistPayload {
  email: string;
  source: string;
}

export interface WaitlistResponse {
  success: boolean;
  email: string;
  message: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  color: string;
  size: string;
  pricePaise: number;
  quantity: number;
  image: string;
}
