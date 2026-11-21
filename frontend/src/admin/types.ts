/**
 * VYOMIK Admin Panel TypeScript Definitions
 * Standardized across OMS, PIM, IMS, CRM, Fulfillment, and Telemetry.
 */

export type AdminRole = 'super_admin' | 'ops_manager' | 'support_agent';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'prepaid' | 'upi' | 'card';

export interface AdminOrderItem {
  id: string;
  sku: string;
  productTitle: string;
  variantTitle: string;
  quantity: number;
  unitPricePaise: number;
  totalPricePaise: number;
  image?: string;
}

export interface AdminShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotalPaise: number;
  shippingFeePaise: number;
  codFeePaise: number;
  discountPaise: number;
  totalPaise: number;
  items: AdminOrderItem[];
  shippingAddress: AdminShippingAddress;
  qikinkOrderId?: string;
  qikinkStatus?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  isLocalOnly?: boolean;
}

export interface AdminProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  pricePaise: number;
  inStock: boolean;
  stockQuantity?: number;
}

export interface AdminProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'hoodies' | 'tees' | 'oversized' | 'accessories';
  basePricePaise: number;
  compareAtPricePaise?: number;
  isActive: boolean;
  featured: boolean;
  images: string[];
  variants: AdminProductVariant[];
  fabricGsm?: number;
  fabricComposition?: string;
  washCare?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistSubscriber {
  email: string;
  subscribedAt: string;
  source?: string;
  status: 'active' | 'invited' | 'converted';
}

export interface AdminCustomer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpentPaise: number;
  lastOrderDate: string;
  isVip: boolean;
}

export interface CouponCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed_paise' | 'free_shipping';
  discountValue: number;
  minSubtotalPaise: number;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
}

export interface AdminReview {
  id: string;
  productSlug: string;
  productTitle: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'flagged';
  createdAt: string;
}

export interface QikinkDiagnosticResult {
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  httpStatus?: number;
  latencyMs: number;
  message: string;
  rawPayload?: any;
}

export interface SystemHealthStatus {
  apiStatus: 'healthy' | 'degraded' | 'offline';
  mongoStatus: 'connected' | 'disconnected' | 'unknown';
  sqlStatus: 'connected' | 'disconnected' | 'unknown';
  qikinkConfigured: boolean;
  latencyMs: number;
  lastChecked: string;
}
