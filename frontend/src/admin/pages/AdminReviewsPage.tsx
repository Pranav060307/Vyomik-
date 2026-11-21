import React, { useState } from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { AdminReview } from '../types';

const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: 'rev_1',
    productSlug: 'core-hoodie-ivory',
    productTitle: 'Core Hoodie — Ivory',
    customerName: 'Aarav Sharma',
    rating: 5,
    title: 'The fabric weight is unreal.',
    comment: '420 GSM French Terry feels substantial and structured. Sits perfectly on shoulders without drooping. Worth every rupee.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-11-20',
  },
  {
    id: 'rev_2',
    productSlug: 'core-hoodie-black',
    productTitle: 'Core Hoodie — Black',
    customerName: 'Ishaan Verma',
    rating: 5,
    title: 'Best streetwear silhouette in India right now.',
    comment: 'The collar contour and ribbed cuffs feel luxury-tier. Delivery was within 3 days via Delhivery.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-11-19',
  },
  {
    id: 'rev_3',
    productSlug: 'wordmark-tee-rust',
    productTitle: 'Wordmark Tee — Rust',
    customerName: 'Rhea Patel',
    rating: 4,
    title: 'Terracotta hue is gorgeous.',
    comment: 'Color is even better in person under natural light. Relaxed fit is true to size.',
    verifiedPurchase: true,
    status: 'pending',
    createdAt: '2026-11-18',
  },
  {
    id: 'rev_4',
    productSlug: 'element-tee-black',
    productTitle: 'Element Tee — Black',
    customerName: 'Anonymous Reviewer',
    rating: 2,
    title: 'Shipping delay',
    comment: 'Took longer than expected to ship to my pincode.',
    verifiedPurchase: false,
    status: 'flagged',
    createdAt: '2026-11-16',
  },
];

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const updateStatus = (id: string, newStatus: 'approved' | 'flagged') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  const columns: Column<AdminReview>[] = [
    {
      key: 'productTitle',
      header: 'Product',
      render: (r) => (
        <div>
          <div className="font-bold text-[#F4F0E8]">{r.productTitle}</div>
          <div className="text-[11px] text-[#716B63]">/{r.productSlug}</div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (r) => (
        <div className="flex items-center gap-1">
          <div className="flex text-[#D9A757]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-[#D9A757]' : 'text-[#38342E]'}`}
              />
            ))}
          </div>
          <span className="text-xs text-[#A8A29E] font-medium ml-1">({r.rating}/5)</span>
        </div>
      ),
    },
    {
      key: 'comment',
      header: 'Review Content',
      render: (r) => (
        <div className="max-w-md">
          <div className="font-semibold text-[#F4F0E8] text-xs">"{r.title}"</div>
          <p className="text-[#A8A29E] text-[11px] mt-0.5 line-clamp-2 leading-relaxed">{r.comment}</p>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Author',
      render: (r) => (
        <div>
          <div className="text-[#F4F0E8] font-medium">{r.customerName}</div>
          {r.verifiedPurchase && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[#86C286] font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Buyer</span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Moderation',
      render: (r) => (
        <StatusBadge
          status={r.status === 'approved' ? 'healthy' : r.status === 'pending' ? 'pending' : 'failed'}
          label={r.status.toUpperCase()}
        />
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          {r.status !== 'approved' && (
            <button
              onClick={() => updateStatus(r.id, 'approved')}
              className="px-2.5 py-1 bg-[#162116] hover:bg-[#1E2D1E] text-[#86C286] border border-[#233823] rounded-lg text-[10px] font-bold uppercase cursor-pointer"
            >
              Approve
            </button>
          )}
          {r.status !== 'flagged' && (
            <button
              onClick={() => updateStatus(r.id, 'flagged')}
              className="px-2.5 py-1 bg-[#241416] hover:bg-[#34181B] text-[#D47984] border border-[#48282D] rounded-lg text-[10px] font-bold uppercase cursor-pointer"
            >
              Flag
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
          SOCIAL PROOF
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
          Customer Reviews & UGC Moderation<span className="text-[#C85A2E]">.</span>
        </h1>
        <p className="text-xs text-[#A8A29E] mt-1">
          Review authentic verified customer testimonials, star distributions, and PDP social proof
        </p>
      </div>

      {/* Moderation Table */}
      <DataTable
        columns={columns}
        data={filteredReviews}
        searchKey={(r) => `${r.productTitle} ${r.customerName} ${r.title} ${r.comment}`}
        searchPlaceholder="Filter reviews by product or comment..."
        filterTabs={[
          { label: 'All Reviews', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Flagged', value: 'flagged' },
        ]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    </div>
  );
};
