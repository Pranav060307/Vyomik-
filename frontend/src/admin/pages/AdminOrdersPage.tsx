import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  Truck,
  ExternalLink,
  Printer,
  MapPin,
  PackageCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { AdminOrder } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord_1',
    orderNumber: 'VYO-784912',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    subtotalPaise: 249900,
    shippingFeePaise: 0,
    codFeePaise: 0,
    discountPaise: 0,
    totalPaise: 249900,
    items: [
      {
        id: 'item_1',
        sku: 'VYO-HOOD-BLK-L',
        productTitle: 'Core Hoodie — Black',
        variantTitle: 'Large / Midnight Black',
        quantity: 1,
        unitPricePaise: 249900,
        totalPricePaise: 249900,
      },
    ],
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Flat 402, Skyline Residency, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
    },
    qikinkOrderId: 'QIK-89124',
    qikinkStatus: 'acknowledged',
    trackingNumber: 'DELHIVERY-789123441',
    trackingUrl: 'https://www.delhivery.com/track/package/789123441',
    createdAt: '2026-11-21 14:32',
    updatedAt: '2026-11-21 14:35',
  },
  {
    id: 'ord_2',
    orderNumber: 'VYO-784911',
    customerName: 'Ishaan Verma',
    customerEmail: 'ishaan.v@example.com',
    customerPhone: '+91 91234 56789',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotalPaise: 429800,
    shippingFeePaise: 0,
    codFeePaise: 0,
    discountPaise: 0,
    totalPaise: 429800,
    items: [
      {
        id: 'item_2a',
        sku: 'VYO-HOOD-IVR-M',
        productTitle: 'Core Hoodie — Ivory',
        variantTitle: 'Medium / Warm Ivory',
        quantity: 1,
        unitPricePaise: 249900,
        totalPricePaise: 249900,
      },
      {
        id: 'item_2b',
        sku: 'VYO-TEE-ELM-BLK-L',
        productTitle: 'Element Tee — Black',
        variantTitle: 'Large / Black',
        quantity: 1,
        unitPricePaise: 179900,
        totalPricePaise: 179900,
      },
    ],
    shippingAddress: {
      fullName: 'Ishaan Verma',
      phone: '+91 91234 56789',
      addressLine1: 'B-12, Sector 44',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201301',
      country: 'India',
    },
    qikinkOrderId: 'QIK-89125',
    qikinkStatus: 'printing',
    createdAt: '2026-11-21 13:48',
    updatedAt: '2026-11-21 14:00',
  },
  {
    id: 'ord_3',
    orderNumber: 'VYO-784910',
    customerName: 'Rhea Patel',
    customerEmail: 'rhea.patel@example.com',
    customerPhone: '+91 98111 22334',
    status: 'dispatched',
    paymentStatus: 'paid',
    paymentMethod: 'prepaid',
    subtotalPaise: 179900,
    shippingFeePaise: 0,
    codFeePaise: 0,
    discountPaise: 0,
    totalPaise: 179900,
    items: [
      {
        id: 'item_3',
        sku: 'VYO-TEE-WDM-RST-M',
        productTitle: 'Wordmark Tee — Rust',
        variantTitle: 'Medium / Burnt Rust',
        quantity: 1,
        unitPricePaise: 179900,
        totalPricePaise: 179900,
      },
    ],
    shippingAddress: {
      fullName: 'Rhea Patel',
      phone: '+91 98111 22334',
      addressLine1: '12th Cross, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    qikinkOrderId: 'QIK-89098',
    qikinkStatus: 'shipped',
    trackingNumber: 'BLUEDART-55442211',
    trackingUrl: 'https://www.bluedart.com',
    createdAt: '2026-11-21 11:20',
    updatedAt: '2026-11-21 13:10',
  },
  {
    id: 'ord_4',
    orderNumber: 'VYO-784909',
    customerName: 'Kabir Mehta',
    customerEmail: 'kabir.m@example.com',
    customerPhone: '+91 97654 32109',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    subtotalPaise: 89900,
    shippingFeePaise: 0,
    codFeePaise: 4900,
    discountPaise: 0,
    totalPaise: 94800,
    items: [
      {
        id: 'item_4',
        sku: 'VYO-CAP-SND-OS',
        productTitle: 'VYOMIK Cap — Sand',
        variantTitle: 'One Size / Sand Khaki',
        quantity: 1,
        unitPricePaise: 89900,
        totalPricePaise: 89900,
      },
    ],
    shippingAddress: {
      fullName: 'Kabir Mehta',
      phone: '+91 97654 32109',
      addressLine1: '88 Heritage Enclave',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380015',
      country: 'India',
    },
    qikinkOrderId: 'QIK-88942',
    qikinkStatus: 'delivered',
    trackingNumber: 'DELHIVERY-99887766',
    createdAt: '2026-11-20 18:14',
    updatedAt: '2026-11-21 10:00',
  },
];

export const AdminOrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [liveLookupNumber, setLiveLookupNumber] = useState<string>('');
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    const searchTarget = searchParams.get('search');
    if (searchTarget) {
      const match = orders.find((o) => o.orderNumber.toLowerCase() === searchTarget.toLowerCase());
      if (match) setSelectedOrder(match);
    }
  }, [searchParams, orders]);

  const handleLiveLookup = async (orderNum: string) => {
    const cleanNum = orderNum.trim().toUpperCase();
    if (!cleanNum) return;

    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${encodeURIComponent(cleanNum)}`);
      if (res.ok) {
        const data = await res.json();
        const mappedOrder: AdminOrder = {
          id: data.id || `live_${data.order_number}`,
          orderNumber: data.order_number,
          customerName: `${data.customer?.first_name || ''} ${data.customer?.last_name || ''}`.trim() || 'Online Customer',
          customerEmail: data.customer?.email || 'customer@vyomik.com',
          customerPhone: data.customer?.phone || 'N/A',
          status: data.status || 'confirmed',
          paymentStatus: data.payment?.status || 'paid',
          paymentMethod: data.payment?.method || 'prepaid',
          subtotalPaise: data.subtotal_paise || data.total_paise || 0,
          shippingFeePaise: data.shipping_fee_paise || 0,
          codFeePaise: data.cod_fee_paise || 0,
          discountPaise: data.discount_paise || 0,
          totalPaise: data.total_paise || 0,
          items: (data.items || []).map((it: any) => ({
            id: it.id,
            sku: it.sku || 'SKU-POD',
            productTitle: it.product_title || 'Streetwear Item',
            variantTitle: it.variant_title || 'Standard',
            quantity: it.quantity || 1,
            unitPricePaise: it.unit_price_paise || 0,
            totalPricePaise: it.total_price_paise || 0,
          })),
          shippingAddress: {
            fullName: data.shipping_address?.full_name || 'Customer',
            phone: data.shipping_address?.phone || '',
            addressLine1: data.shipping_address?.address_line_1 || '',
            addressLine2: data.shipping_address?.address_line_2,
            city: data.shipping_address?.city || '',
            state: data.shipping_address?.state || '',
            postalCode: data.shipping_address?.postal_code || '',
            country: data.shipping_address?.country || 'India',
          },
          qikinkOrderId: data.qikink_order_id,
          qikinkStatus: data.qikink_status || 'synced',
          trackingNumber: data.tracking_number,
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        };

        setOrders((prev) => {
          if (!prev.some((o) => o.orderNumber === mappedOrder.orderNumber)) {
            return [mappedOrder, ...prev];
          }
          return prev;
        });

        setSelectedOrder(mappedOrder);
      } else {
        setLookupError(`Order "${cleanNum}" was not found in the live backend database.`);
      }
    } catch {
      setLookupError('Network error connecting to backend order service.');
    } finally {
      setLookupLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.status === activeFilter;
  });

  const columns: Column<AdminOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order Number',
      render: (o) => (
        <div className="font-bold text-[#F4F0E8] flex items-center gap-1.5">
          <span>{o.orderNumber}</span>
          {o.isLocalOnly && (
            <span className="text-[9px] px-1.5 py-0.5 bg-[#242321] text-[#A8A29E] rounded">CACHE</span>
          )}
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (o) => (
        <div>
          <div className="font-semibold text-[#F4F0E8]">{o.customerName}</div>
          <div className="text-[11px] text-[#716B63]">{o.customerEmail}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (o) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={o.paymentStatus} />
          <span className="text-[10px] uppercase font-semibold text-[#716B63]">({o.paymentMethod})</span>
        </div>
      ),
    },
    {
      key: 'qikinkStatus',
      header: 'Fulfillment',
      render: (o) => (
        <div className="text-xs">
          {o.qikinkOrderId ? (
            <div className="flex items-center gap-1.5 text-[#86C286] font-semibold">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>{o.qikinkStatus || 'SYNCED'}</span>
            </div>
          ) : (
            <span className="text-[#716B63] font-medium">PENDING POD</span>
          )}
        </div>
      ),
    },
    {
      key: 'totalPaise',
      header: 'Amount',
      align: 'right',
      render: (o) => (
        <span className="font-bold text-[#F4F0E8]">
          ₹{(o.totalPaise / 100).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      align: 'right',
      render: (o) => <span className="text-[#716B63]">{o.createdAt}</span>,
    },
  ];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Title & Live Lookup Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
            SALES LOGISTICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
            Order Master Management<span className="text-[#C85A2E]">.</span>
          </h1>
          <p className="text-xs text-[#A8A29E] mt-1">
            Track customer orders, Qikink POD dispatch states, and line-item fulfillments
          </p>
        </div>

        {/* Live Order Query Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={liveLookupNumber}
            onChange={(e) => setLiveLookupNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLiveLookup(liveLookupNumber)}
            placeholder="Query order (e.g. VYO-784912)..."
            className="bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl pl-3.5 pr-4 py-2.5 text-xs text-[#F4F0E8] placeholder:text-[#716B63] outline-none w-64 transition-colors"
          />
          <button
            onClick={() => handleLiveLookup(liveLookupNumber)}
            disabled={lookupLoading}
            className="px-4 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {lookupLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Lookup</span>
          </button>
        </div>
      </div>

      {lookupError && (
        <div className="p-3.5 bg-[#261517] border border-[#48282D] rounded-xl text-xs text-[#D47984] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D47984]" />
          <span>{lookupError}</span>
        </div>
      )}

      {/* Orders Master Data Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchKey={(o) => `${o.orderNumber} ${o.customerName} ${o.customerEmail}`}
        searchPlaceholder="Filter by order number, customer name, email..."
        filterTabs={[
          { label: 'All', value: 'all' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Processing', value: 'processing' },
          { label: 'Dispatched', value: 'dispatched' },
          { label: 'Delivered', value: 'delivered' },
        ]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onRowClick={(order) => setSelectedOrder(order)}
      />

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#141414] border-l border-[#242321] h-full flex flex-col justify-between overflow-y-auto p-6 sm:p-8 text-xs font-montserrat shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#242321]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C85A2E]">
                    ORDER DRILLDOWN
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4F0E8] mt-1">
                    {selectedOrder.orderNumber}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-[#716B63] hover:text-[#F4F0E8] hover:bg-[#1E1B18] rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Ribbon */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#0B0B0B] border border-[#242321] rounded-xl">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#716B63] block mb-1.5">Order Status</span>
                  <StatusBadge status={selectedOrder.status} size="md" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#716B63] block mb-1.5">Payment State</span>
                  <StatusBadge status={selectedOrder.paymentStatus} size="md" />
                </div>
              </div>

              {/* Line Items List */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block mb-3">
                  ORDERED STREETWEAR ITEMS ({selectedOrder.items.length})
                </span>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-[#0B0B0B] border border-[#242321] rounded-xl flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-bold text-[#F4F0E8] text-sm">{item.productTitle}</div>
                        <div className="text-xs text-[#A8A29E] mt-0.5">{item.variantTitle}</div>
                        <div className="text-[11px] text-[#716B63] mt-1">SKU: {item.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#716B63]">
                          {item.quantity} × ₹{(item.unitPricePaise / 100).toLocaleString('en-IN')}
                        </div>
                        <div className="font-bold text-[#C85A2E] text-sm mt-0.5">
                          ₹{(item.totalPricePaise / 100).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-[#0B0B0B] border border-[#242321] rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-[#A8A29E]">
                  <span>Subtotal</span>
                  <span>₹{(selectedOrder.subtotalPaise / 100).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#A8A29E]">
                  <span>Shipping Fee</span>
                  <span>
                    {selectedOrder.shippingFeePaise === 0
                      ? 'FREE'
                      : `₹${(selectedOrder.shippingFeePaise / 100).toLocaleString('en-IN')}`}
                  </span>
                </div>
                {selectedOrder.codFeePaise > 0 && (
                  <div className="flex justify-between text-[#A8A29E]">
                    <span>COD Convenience Surcharge</span>
                    <span>₹{(selectedOrder.codFeePaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#242321] flex justify-between text-[#F4F0E8] font-bold text-sm">
                  <span>Grand Total</span>
                  <span className="text-[#C85A2E]">
                    ₹{(selectedOrder.totalPaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Delivery Destination */}
              <div className="p-4 bg-[#0B0B0B] border border-[#242321] rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#C85A2E]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Destination</span>
                </div>
                <div className="text-xs text-[#F4F0E8] font-semibold">
                  {selectedOrder.shippingAddress.fullName}
                </div>
                <div className="text-xs text-[#A8A29E] leading-relaxed">
                  {selectedOrder.shippingAddress.addressLine1}
                  {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                  <br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} —{' '}
                  <span className="font-bold text-[#F4F0E8]">
                    {selectedOrder.shippingAddress.postalCode}
                  </span>
                </div>
                <div className="text-xs text-[#716B63] pt-1">
                  Contact: {selectedOrder.shippingAddress.phone}
                </div>
              </div>

              {/* Qikink POD Logistics Status */}
              <div className="p-4 bg-[#0B0B0B] border border-[#242321] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#C85A2E]">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Qikink POD Dispatch</span>
                  </div>
                  {selectedOrder.qikinkOrderId && (
                    <span className="text-[10px] font-bold bg-[#162116] text-[#86C286] border border-[#233823] px-2 py-0.5 rounded-full">
                      SYNCED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[#716B63] block">POD Order ID:</span>
                    <span className="text-[#F4F0E8] font-medium">{selectedOrder.qikinkOrderId || 'Pending Dispatch'}</span>
                  </div>
                  <div>
                    <span className="text-[#716B63] block">Tracking AWB:</span>
                    <span className="text-[#F4F0E8] font-medium">{selectedOrder.trackingNumber || 'Awaiting Pickup'}</span>
                  </div>
                </div>

                {selectedOrder.trackingUrl && (
                  <a
                    href={selectedOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#C85A2E] hover:underline mt-1"
                  >
                    <span>Track Live Delivery</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#242321] flex items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1C1A18] border border-[#242321] rounded-xl text-xs font-semibold text-[#D9D1C3] hover:text-[#F4F0E8] transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C85A2E]" />
                <span>Print Packing Slip</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
