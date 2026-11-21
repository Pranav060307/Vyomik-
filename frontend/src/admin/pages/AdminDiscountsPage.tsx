import React, { useState } from 'react';
import { Plus, Code2 } from 'lucide-react';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { CouponCode } from '../types';

const INITIAL_COUPONS: CouponCode[] = [
  {
    id: 'c1',
    code: 'VIP10',
    discountType: 'percentage',
    discountValue: 10,
    minSubtotalPaise: 149900,
    usageLimit: 500,
    usageCount: 142,
    isActive: true,
    startsAt: '2026-11-01',
    expiresAt: '2026-12-31',
  },
  {
    id: 'c2',
    code: 'LAUNCHDROP',
    discountType: 'fixed_paise',
    discountValue: 30000,
    minSubtotalPaise: 249900,
    usageLimit: 200,
    usageCount: 68,
    isActive: true,
    startsAt: '2026-11-15',
    expiresAt: '2026-11-30',
  },
  {
    id: 'c3',
    code: 'FREESHIP',
    discountType: 'free_shipping',
    discountValue: 0,
    minSubtotalPaise: 99900,
    usageLimit: 1000,
    usageCount: 384,
    isActive: false,
    startsAt: '2026-10-01',
    expiresAt: '2026-10-31',
  },
];

export const AdminDiscountsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponCode[]>(INITIAL_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContractSpec, setShowContractSpec] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed_paise' | 'free_shipping'>('percentage');
  const [newValue, setNewValue] = useState('15');
  const [newMinSubtotal, setNewMinSubtotal] = useState('1499');

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newCoupon: CouponCode = {
      id: `c_${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discountType: newType,
      discountValue: newType === 'fixed_paise' ? parseInt(newValue, 10) * 100 : parseInt(newValue, 10),
      minSubtotalPaise: parseInt(newMinSubtotal, 10) * 100,
      usageLimit: 250,
      usageCount: 0,
      isActive: true,
      startsAt: new Date().toISOString().split('T')[0],
      expiresAt: '2026-12-31',
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    setIsModalOpen(false);
    setNewCode('');
  };

  const columns: Column<CouponCode>[] = [
    {
      key: 'code',
      header: 'Promo Code',
      render: (c) => (
        <span className="font-bold text-sm tracking-wider text-[#F4F0E8] bg-[#0B0B0B] border border-[#242321] px-3 py-1.5 rounded-lg">
          {c.code}
        </span>
      ),
    },
    {
      key: 'discountType',
      header: 'Reward Type',
      render: (c) => (
        <span className="text-xs uppercase font-semibold text-[#A8A29E]">
          {c.discountType === 'percentage'
            ? `${c.discountValue}% OFF`
            : c.discountType === 'fixed_paise'
            ? `₹${c.discountValue / 100} OFF`
            : 'FREE SHIPPING'}
        </span>
      ),
    },
    {
      key: 'minSubtotalPaise',
      header: 'Min Cart Value',
      align: 'right',
      render: (c) => (
        <span className="font-bold text-[#F4F0E8]">
          ₹{(c.minSubtotalPaise / 100).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'usageCount',
      header: 'Usage / Cap',
      align: 'center',
      render: (c) => (
        <span className="text-[#A8A29E] font-medium">
          {c.usageCount} / {c.usageLimit}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (c) => (
        <StatusBadge
          status={c.isActive ? 'in_stock' : 'out_of_stock'}
          label={c.isActive ? 'ACTIVE' : 'EXPIRED / PAUSED'}
        />
      ),
    },
    {
      key: 'id',
      header: 'Action',
      align: 'right',
      render: (c) => (
        <button
          onClick={() => toggleCoupon(c.id)}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#242321] bg-[#0B0B0B] hover:bg-[#1C1A18] text-[#A8A29E] hover:text-[#F4F0E8] transition-colors cursor-pointer"
        >
          {c.isActive ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
            CONVERSION TOOLS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
            Discounts & Promotional Engine<span className="text-[#C85A2E]">.</span>
          </h1>
          <p className="text-xs text-[#A8A29E] mt-1">
            Manage promotional coupons, cart threshold campaigns, and influencer codes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowContractSpec(!showContractSpec)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#141414] hover:bg-[#1C1A18] border border-[#242321] rounded-xl text-xs font-semibold text-[#D9D1C3] hover:text-[#F4F0E8] transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-[#C85A2E]" />
            <span>API Contract Spec</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </button>
        </div>
      </div>

      {showContractSpec && (
        <div className="p-5 bg-[#141414] border border-[#242321] rounded-2xl text-xs space-y-2 animate-in fade-in shadow-2xl">
          <div className="text-[10px] uppercase text-[#C85A2E] font-bold tracking-wider">
            Future Backend Integration Contract: POST /api/v1/discounts/validate
          </div>
          <pre className="p-4 bg-[#0B0B0B] border border-[#242321] rounded-xl text-[#A8A29E] text-xs overflow-x-auto font-mono">
{`// Expected Request Payload
{
  "code": "VIP10",
  "subtotal_paise": 249900,
  "customer_id": "uuid-optional"
}

// Expected 200 OK Response
{
  "valid": true,
  "discount_type": "percentage",
  "discount_amount_paise": 24990,
  "final_subtotal_paise": 224910,
  "message": "10% VIP drop discount applied"
}`}
          </pre>
        </div>
      )}

      {/* Coupon Table */}
      <DataTable
        columns={columns}
        data={coupons}
        searchKey="code"
        searchPlaceholder="Search promo codes..."
      />

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-8 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#242321]">
              <h3 className="text-lg font-bold text-[#F4F0E8]">New Promotional Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#716B63] hover:text-[#F4F0E8] cursor-pointer text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. STREET15"
                  className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 font-bold text-sm text-[#F4F0E8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] outline-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_paise">Fixed Amount (₹)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
                    Value {newType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    disabled={newType === 'free_shipping'}
                    className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Min Cart Value (INR)</label>
                <input
                  type="number"
                  value={newMinSubtotal}
                  onChange={(e) => setNewMinSubtotal(e.target.value)}
                  placeholder="1499"
                  className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1C1A18] border border-[#242321] rounded-xl text-xs font-semibold text-[#A8A29E] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
