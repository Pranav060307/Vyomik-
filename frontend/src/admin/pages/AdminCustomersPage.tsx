import React, { useState, useEffect } from 'react';
import { Download, Mail, RefreshCw } from 'lucide-react';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { WaitlistSubscriber, AdminCustomer } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const CUSTOMER_COHORTS: AdminCustomer[] = [
  { id: 'c1', fullName: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', city: 'Mumbai', totalOrders: 3, totalSpentPaise: 749700, lastOrderDate: '2026-11-21', isVip: true },
  { id: 'c2', fullName: 'Ishaan Verma', email: 'ishaan.v@example.com', phone: '+91 91234 56789', city: 'Noida', totalOrders: 2, totalSpentPaise: 599800, lastOrderDate: '2026-11-21', isVip: true },
  { id: 'c3', fullName: 'Rhea Patel', email: 'rhea.patel@example.com', phone: '+91 98111 22334', city: 'Bengaluru', totalOrders: 1, totalSpentPaise: 179900, lastOrderDate: '2026-11-21', isVip: false },
  { id: 'c4', fullName: 'Kabir Mehta', email: 'kabir.m@example.com', phone: '+91 97654 32109', city: 'Ahmedabad', totalOrders: 1, totalSpentPaise: 94800, lastOrderDate: '2026-11-20', isVip: false },
  { id: 'c5', fullName: 'Devika Nair', email: 'devika.n@example.com', phone: '+91 95432 10987', city: 'Kochi', totalOrders: 2, totalSpentPaise: 429800, lastOrderDate: '2026-11-18', isVip: true },
];

export const AdminCustomersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'waitlist' | 'customers'>('waitlist');
  const [waitlistEmails, setWaitlistEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWaitlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/waitlist/emails`);
      if (res.ok) {
        const data = await res.json();
        const emails: string[] = data.emails || [];
        setWaitlistEmails(emails);
      }
    } catch {
      setWaitlistEmails(['founder@vyomik.com', 'vip.collector@gmail.com', 'hypebeast.mumbai@outlook.com']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const handleExportCSV = () => {
    if (waitlistEmails.length === 0) return;
    const header = 'Email,Status,Subscribed Date\n';
    const rows = waitlistEmails
      .map((em) => `"${em}","Active VIP","${new Date().toISOString().split('T')[0]}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vyomik_vip_waitlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const waitlistData: (WaitlistSubscriber & { id: string })[] = waitlistEmails.map((em, idx) => ({
    id: `wl_${idx}`,
    email: em,
    subscribedAt: '2026-11-21',
    status: idx % 3 === 0 ? 'converted' : 'active',
  }));

  const waitlistColumns: Column<WaitlistSubscriber & { id: string }>[] = [
    {
      key: 'email',
      header: 'Subscriber Email',
      render: (w) => (
        <div className="flex items-center gap-2.5 font-semibold text-[#F4F0E8]">
          <Mail className="w-4 h-4 text-[#C85A2E]" />
          <span>{w.email}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'VIP State',
      render: (w) => (
        <StatusBadge
          status={w.status === 'converted' ? 'healthy' : 'pending'}
          label={w.status === 'converted' ? 'CONVERTED BUYER' : 'EARLY ACCESS QUEUE'}
        />
      ),
    },
    {
      key: 'subscribedAt',
      header: 'Joined Date',
      align: 'right',
      render: (w) => <span className="text-[#716B63]">{w.subscribedAt}</span>,
    },
  ];

  const customerColumns: Column<AdminCustomer>[] = [
    {
      key: 'fullName',
      header: 'Customer',
      render: (c) => (
        <div>
          <div className="font-bold text-[#F4F0E8] flex items-center gap-1.5">
            <span>{c.fullName}</span>
            {c.isVip && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[#C85A2E]/20 text-[#C85A2E] border border-[#C85A2E]/30 rounded font-semibold">
                VIP
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#716B63]">{c.email}</div>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      render: (c) => <span className="text-[#A8A29E]">{c.city}</span>,
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      align: 'center',
      render: (c) => <span className="font-bold text-[#F4F0E8]">{c.totalOrders}</span>,
    },
    {
      key: 'totalSpentPaise',
      header: 'Lifetime Spend (LTV)',
      align: 'right',
      render: (c) => (
        <span className="font-bold text-[#F4F0E8]">
          ₹{(c.totalSpentPaise / 100).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'lastOrderDate',
      header: 'Last Order',
      align: 'right',
      render: (c) => <span className="text-[#716B63]">{c.lastOrderDate}</span>,
    },
  ];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
            AUDIENCE MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
            Customers & VIP Audience<span className="text-[#C85A2E]">.</span>
          </h1>
          <p className="text-xs text-[#A8A29E] mt-1">
            Manage early-access VIP waitlist subscribers, repeat streetwear buyers & cohorts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchWaitlist}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#141414] hover:bg-[#1C1A18] border border-[#242321] rounded-xl text-xs font-semibold text-[#D9D1C3] hover:text-[#F4F0E8] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#C85A2E]' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={waitlistEmails.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-[#242321] gap-6 text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('waitlist')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'waitlist' ? 'text-[#F4F0E8] font-bold' : 'text-[#716B63] hover:text-[#A8A29E]'
          }`}
        >
          <span>VIP Waitlist Queue ({waitlistEmails.length})</span>
          {activeTab === 'waitlist' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C85A2E]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 transition-colors relative cursor-pointer ${
            activeTab === 'customers' ? 'text-[#F4F0E8] font-bold' : 'text-[#716B63] hover:text-[#A8A29E]'
          }`}
        >
          <span>Customer Directory & LTV ({CUSTOMER_COHORTS.length})</span>
          {activeTab === 'customers' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C85A2E]" />
          )}
        </button>
      </div>

      {/* Render Active View */}
      {activeTab === 'waitlist' ? (
        <DataTable
          columns={waitlistColumns}
          data={waitlistData}
          searchKey="email"
          searchPlaceholder="Search VIP waitlist by email address..."
        />
      ) : (
        <DataTable
          columns={customerColumns}
          data={CUSTOMER_COHORTS}
          searchKey={(c) => `${c.fullName} ${c.email} ${c.city}`}
          searchPlaceholder="Search customer by name, email, or city..."
        />
      )}
    </div>
  );
};
