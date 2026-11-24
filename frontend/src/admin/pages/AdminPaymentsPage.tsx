import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QrCode,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  FileCheck,
  X,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';

interface PaymentItem {
  id: number;
  tr: string;
  order_number: string;
  customer_name?: string;
  customer_email?: string;
  customer_upi_id?: string;
  amount_paise: number;
  amount_inr: number;
  status: 'created' | 'awaiting_payment' | 'verifying' | 'paid' | 'failed' | 'expired' | 'manual_review';
  utr_number?: string;
  created_at: string;
  verified_at?: string;
  receipt_number?: string;
}

interface AdminPaymentsResponse {
  total_volume_paise: number;
  total_volume_inr: number;
  total_count: number;
  verified_count: number;
  awaiting_count: number;
  manual_review_count: number;
  failed_count: number;
  payments: PaymentItem[];
}

export const AdminPaymentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForReconcile, setSelectedForReconcile] = useState<PaymentItem | null>(null);
  const [reconcileUtr, setReconcileUtr] = useState('');
  const [reconcileNotes, setReconcileNotes] = useState('');
  const [reconcileError, setReconcileError] = useState<string | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery<AdminPaymentsResponse>({
    queryKey: ['admin-payments', statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res = await fetch(`${apiBase}/api/v1/admin/payments?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch payments data');
      return res.json();
    },
  });

  const reconcileMutation = useMutation({
    mutationFn: async (payload: { tr: string; utr: string; notes: string }) => {
      const res = await fetch(`${apiBase}/api/v1/admin/payments/reconcile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tr: payload.tr,
          utr: payload.utr,
          notes: payload.notes,
          admin_email: 'operations@vyomik.com',
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to reconcile payment');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      setSelectedForReconcile(null);
      setReconcileUtr('');
      setReconcileNotes('');
      setReconcileError(null);
    },
    onError: (err: any) => {
      setReconcileError(err.message || 'Error executing manual reconciliation');
    },
  });

  const handleOpenReconcile = (payment: PaymentItem) => {
    setSelectedForReconcile(payment);
    setReconcileUtr(payment.utr_number || '');
    setReconcileNotes(`Matched manually by Admin for customer ${payment.customer_name || payment.customer_email || 'VIP'}`);
    setReconcileError(null);
  };

  const handleExecuteReconcile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForReconcile) return;
    if (!reconcileUtr.trim()) {
      setReconcileError('Bank UTR / UPI Reference No. is mandatory for proof of payment.');
      return;
    }
    reconcileMutation.mutate({
      tr: selectedForReconcile.tr,
      utr: reconcileUtr.trim(),
      notes: reconcileNotes.trim() || 'Verified against bank credit advice.',
    });
  };

  const formatCurrency = (amountInr: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amountInr || 0);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 select-none font-montserrat">
      {/* 1. Header & Live Telemetry Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#242321]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C85A2E] block mb-1">
            FINANCIAL OPERATIONS & SETTLEMENTS
          </span>
          <h1 className="text-2xl font-bold text-[#F4F0E8] tracking-tight">
            UPI QR Payments & Reconciliation<span className="text-[#C85A2E]">.</span>
          </h1>
          <p className="text-xs text-[#A8A29E] mt-1">
            Automated HDFC Bank credit matching, UTR tracking, and downloadable PDF receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1E1B19] border border-[#242321] text-xs font-semibold text-[#D9D1C3] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#C85A2E]' : ''}`} />
          <span>Sync Ledger</span>
        </button>
      </div>

      {/* 2. Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Volume Collected"
          value={formatCurrency(data?.total_volume_inr || 0)}
          subtitle={`${data?.verified_count || 0} automated bank credits`}
          icon={QrCode}
        />
        <MetricCard
          title="Verified Transactions"
          value={data?.verified_count || 0}
          subtitle="Confirmed via HDFC Bank"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Awaiting Verification"
          value={data?.awaiting_count || 0}
          subtitle="QR active or polling"
          icon={Clock}
        />
        <MetricCard
          title="Manual Review Queue"
          value={data?.manual_review_count || 0}
          subtitle="Requires admin confirmation"
          icon={AlertTriangle}
        />
      </div>

      {/* 3. Search and Filter Bar */}
      <div className="bg-[#141414] border border-[#242321] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#716B63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by TR, Order, UTR, or UPI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl text-xs text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#716B63] mr-1 hidden sm:block" />
          {[
            { id: 'all', label: 'All' },
            { id: 'paid', label: 'Paid' },
            { id: 'awaiting_payment', label: 'Awaiting' },
            { id: 'verifying', label: 'Verifying' },
            { id: 'manual_review', label: 'Manual Review' },
            { id: 'expired', label: 'Expired' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#24201D] text-[#F4F0E8] border border-[#C85A2E]'
                  : 'bg-[#0B0B0B] text-[#716B63] border border-[#242321] hover:text-[#D9D1C3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Transactions Data Table */}
      <div className="bg-[#141414] border border-[#242321] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0B0B] border-b border-[#242321] text-[10px] uppercase font-bold text-[#716B63] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order / TR</th>
                <th className="py-3.5 px-4">Customer Info</th>
                <th className="py-3.5 px-4">Payer UPI ID</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4">Bank UTR / Ref</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242321] text-[#D9D1C3]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#716B63]">
                    <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-[#C85A2E] rounded-full animate-spin mb-2" />
                    <div>Loading payment transactions...</div>
                  </td>
                </tr>
              ) : !data?.payments || data.payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#716B63]">
                    <QrCode className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <div>No payment records found matching your filters.</div>
                  </td>
                </tr>
              ) : (
                data.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1A1816] transition-colors">
                    {/* Order / TR */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F4F0E8]">{p.order_number}</div>
                      <div className="font-mono text-[10px] text-[#716B63]">{p.tr}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#F4F0E8]">{p.customer_name || 'Valued Customer'}</div>
                      <div className="text-[11px] text-[#716B63]">{p.customer_email || '—'}</div>
                    </td>

                    {/* Payer UPI */}
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {p.customer_upi_id ? (
                        <span className="text-[#D9D1C3] bg-[#0B0B0B] px-2 py-1 rounded border border-[#242321]">
                          {p.customer_upi_id}
                        </span>
                      ) : (
                        <span className="text-[#555]">Pending Input</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-bold text-[#F4F0E8]">
                      ₹{p.amount_inr.toLocaleString('en-IN')}
                    </td>

                    {/* Bank UTR */}
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {p.utr_number ? (
                        <span className="text-[#86C286]">{p.utr_number}</span>
                      ) : (
                        <span className="text-[#716B63]">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#716B63] text-[11px]">
                      {formatDate(p.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status === 'paid' ? (
                          <a
                            href={`${apiBase}/api/v1/payments/receipt/${p.tr}/download`}
                            download
                            className="p-1.5 rounded-lg bg-[#201E1C] hover:bg-[#2A2623] border border-[#242321] text-[#F4F0E8] hover:text-[#C85A2E] transition-colors"
                            title="Download PDF Receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReconcile(p)}
                            className="px-2.5 py-1 rounded-lg bg-[#241D13] hover:bg-[#332717] border border-[#D9A757]/40 text-[#D9A757] text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Reconcile
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Manual Reconciliation Modal */}
      {selectedForReconcile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setSelectedForReconcile(null)}
              className="absolute right-5 top-5 p-1 rounded-lg hover:bg-[#201E1C] text-[#716B63] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C85A2E] block mb-1">
              OPERATIONS MANUAL RECONCILIATION
            </span>
            <h2 className="text-xl font-bold text-[#F4F0E8] tracking-tight mb-2">
              Verify Transaction Match
            </h2>
            <p className="text-xs text-[#A8A29E] leading-relaxed mb-6">
              Manually associate an unmatched bank notification credit with order{' '}
              <span className="font-bold text-[#F4F0E8]">{selectedForReconcile.order_number}</span>.
            </p>

            {reconcileError && (
              <div className="mb-4 p-3 bg-[#241416] border border-[#D47984]/40 rounded-xl text-xs text-[#D47984]">
                {reconcileError}
              </div>
            )}

            <form onSubmit={handleExecuteReconcile} className="space-y-4">
              <div className="p-3.5 bg-[#0B0B0B] border border-[#242321] rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#716B63]">Order Total:</span>
                  <span className="font-bold text-[#F4F0E8]">₹{selectedForReconcile.amount_inr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#716B63]">Customer Payer UPI:</span>
                  <span className="font-mono text-[#F4F0E8]">{selectedForReconcile.customer_upi_id || 'Not recorded'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#716B63]">Transaction Ref (TR):</span>
                  <span className="font-mono text-[#A8A29E]">{selectedForReconcile.tr}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D9D1C3] mb-1.5">
                  Bank UTR / UPI Reference No. <span className="text-[#C85A2E]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 630155807241"
                  value={reconcileUtr}
                  onChange={(e) => setReconcileUtr(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl text-xs font-mono text-[#F4F0E8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D9D1C3] mb-1.5">
                  Reconciliation Notes & Justification <span className="text-[#C85A2E]">*</span>
                </label>
                <textarea
                  rows={2}
                  value={reconcileNotes}
                  onChange={(e) => setReconcileNotes(e.target.value)}
                  placeholder="e.g. Cross-checked with HDFC Bank statement. Payer name matched Vibhav Patel."
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl text-xs text-[#F4F0E8] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedForReconcile(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#201E1C] hover:bg-[#2A2623] border border-[#242321] text-xs font-semibold text-[#A8A29E] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reconcileMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {reconcileMutation.isPending ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      <span>Confirm & Issue Receipt</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
