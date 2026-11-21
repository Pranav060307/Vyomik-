import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, ShieldAlert } from 'lucide-react';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface InventoryItem {
  id: string;
  sku: string;
  productTitle: string;
  category: string;
  size: string;
  color: string;
  stockType: 'POD On-Demand' | 'Buffered Stock';
  inStock: boolean;
  unitsAvailable: number;
  lowStockThreshold: number;
}

const INVENTORY_DATA: InventoryItem[] = [
  { id: '1', sku: 'VYO-HOOD-IVR-S', productTitle: 'Core Hoodie — Ivory', category: 'Hoodies', size: 'S', color: 'Ivory', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 15, lowStockThreshold: 5 },
  { id: '2', sku: 'VYO-HOOD-IVR-M', productTitle: 'Core Hoodie — Ivory', category: 'Hoodies', size: 'M', color: 'Ivory', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 28, lowStockThreshold: 5 },
  { id: '3', sku: 'VYO-HOOD-IVR-L', productTitle: 'Core Hoodie — Ivory', category: 'Hoodies', size: 'L', color: 'Ivory', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 22, lowStockThreshold: 5 },
  { id: '4', sku: 'VYO-HOOD-IVR-XL', productTitle: 'Core Hoodie — Ivory', category: 'Hoodies', size: 'XL', color: 'Ivory', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 12, lowStockThreshold: 5 },
  { id: '5', sku: 'VYO-HOOD-BLK-S', productTitle: 'Core Hoodie — Black', category: 'Hoodies', size: 'S', color: 'Black', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 18, lowStockThreshold: 5 },
  { id: '6', sku: 'VYO-HOOD-BLK-M', productTitle: 'Core Hoodie — Black', category: 'Hoodies', size: 'M', color: 'Black', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 34, lowStockThreshold: 5 },
  { id: '7', sku: 'VYO-HOOD-BLK-L', productTitle: 'Core Hoodie — Black', category: 'Hoodies', size: 'L', color: 'Black', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 25, lowStockThreshold: 5 },
  { id: '8', sku: 'VYO-HOOD-BLK-XL', productTitle: 'Core Hoodie — Black', category: 'Hoodies', size: 'XL', color: 'Black', stockType: 'POD On-Demand', inStock: false, unitsAvailable: 0, lowStockThreshold: 5 },
  { id: '9', sku: 'VYO-TEE-WDM-RST-S', productTitle: 'Wordmark Tee — Rust', category: 'Tees', size: 'S', color: 'Rust', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 14, lowStockThreshold: 5 },
  { id: '10', sku: 'VYO-TEE-WDM-RST-M', productTitle: 'Wordmark Tee — Rust', category: 'Tees', size: 'M', color: 'Rust', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 3, lowStockThreshold: 5 },
  { id: '11', sku: 'VYO-TEE-ELM-BLK-L', productTitle: 'Element Tee — Black', category: 'Tees', size: 'L', color: 'Black', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 19, lowStockThreshold: 5 },
  { id: '12', sku: 'VYO-SWT-STN-M', productTitle: 'Heavyweight Sweatshirt — Stone', category: 'Sweatshirt', size: 'M', color: 'Raw Stone', stockType: 'POD On-Demand', inStock: true, unitsAvailable: 28, lowStockThreshold: 5 },
];

export const AdminInventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_DATA);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/inventory`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setItems(
            data.map((d: any) => ({
              id: d.id,
              sku: d.sku,
              productTitle: d.product_title,
              category: d.category,
              size: d.size,
              color: d.color,
              stockType: d.stock_type,
              inStock: d.in_stock,
              unitsAvailable: d.units_available,
              lowStockThreshold: d.low_stock_threshold,
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Failed to fetch inventory from backend:', err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const toggleStock = async (id: string) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;

    const newInStock = !target.inStock;
    const newUnits = newInStock ? 25 : 0;

    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, inStock: newInStock, unitsAvailable: newUnits } : it))
    );

    try {
      await fetch(`${API_BASE_URL}/api/v1/admin/inventory/${encodeURIComponent(target.sku)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ in_stock: newInStock, units_available: newUnits }),
      });
    } catch (err) {
      console.error('Failed to update inventory in backend:', err);
    }
  };

  const filteredItems = items.filter((it) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'low_stock') return it.inStock && it.unitsAvailable <= it.lowStockThreshold;
    if (activeFilter === 'out_of_stock') return !it.inStock;
    return it.stockType.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const columns: Column<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU Code',
      render: (i) => <span className="font-bold text-[#F4F0E8]">{i.sku}</span>,
    },
    {
      key: 'productTitle',
      header: 'Product & Variant',
      render: (i) => (
        <div>
          <div className="font-semibold text-[#F4F0E8]">{i.productTitle}</div>
          <div className="text-[11px] text-[#716B63]">
            Size: <span className="text-[#A8A29E] font-medium">{i.size}</span> | Color: <span className="text-[#A8A29E] font-medium">{i.color}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'stockType',
      header: 'Fulfillment Type',
      render: (i) => (
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#0B0B0B] border border-[#242321] text-[#A8A29E]">
          {i.stockType}
        </span>
      ),
    },
    {
      key: 'unitsAvailable',
      header: 'Units (Est.)',
      align: 'right',
      render: (i) => (
        <span className={`font-bold tabular-nums ${i.unitsAvailable <= i.lowStockThreshold && i.inStock ? 'text-[#D9A757]' : 'text-[#F4F0E8]'}`}>
          {i.unitsAvailable}
        </span>
      ),
    },
    {
      key: 'inStock',
      header: 'Availability',
      render: (i) => {
        if (!i.inStock) return <StatusBadge status="out_of_stock" label="SOLD OUT" />;
        if (i.unitsAvailable <= i.lowStockThreshold) return <StatusBadge status="low_stock" label="LOW STOCK" />;
        return <StatusBadge status="in_stock" label="AVAILABLE" />;
      },
    },
    {
      key: 'id',
      header: 'Quick Action',
      align: 'right',
      render: (i) => (
        <button
          onClick={() => toggleStock(i.id)}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-colors cursor-pointer ${
            i.inStock
              ? 'bg-[#241416] text-[#D47984] border-[#48282D] hover:bg-[#34181B]'
              : 'bg-[#162116] text-[#86C286] border-[#233823] hover:bg-[#1E2D1E]'
          }`}
        >
          {i.inStock ? 'Mark Out of Stock' : 'Restock'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
          SUPPLY ASSURANCE
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
          Inventory & Stock Management<span className="text-[#C85A2E]">.</span>
        </h1>
        <p className="text-xs text-[#A8A29E] mt-1">
          Monitor Qikink on-demand POD capacity, buffered merchandise, and stockout thresholds
        </p>
      </div>

      {/* Stock Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#A8A29E]">ACTIVE SKUS</span>
            <div className="text-2xl sm:text-3xl font-bold text-[#F4F0E8] mt-1.5">{items.length}</div>
          </div>
          <Boxes className="w-5 h-5 text-[#C85A2E]" />
        </div>

        <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#A8A29E]">LOW STOCK ALERTS</span>
            <div className="text-2xl sm:text-3xl font-bold text-[#D9A757] mt-1.5">
              {items.filter((i) => i.inStock && i.unitsAvailable <= i.lowStockThreshold).length}
            </div>
          </div>
          <AlertTriangle className="w-5 h-5 text-[#D9A757]" />
        </div>

        <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#A8A29E]">SOLD OUT SKUS</span>
            <div className="text-2xl sm:text-3xl font-bold text-[#D47984] mt-1.5">
              {items.filter((i) => !i.inStock).length}
            </div>
          </div>
          <ShieldAlert className="w-5 h-5 text-[#D47984]" />
        </div>
      </div>

      {/* Inventory Table */}
      <DataTable
        columns={columns}
        data={filteredItems}
        searchKey={(i) => `${i.sku} ${i.productTitle} ${i.size} ${i.color}`}
        searchPlaceholder="Search SKU, product title, or size..."
        filterTabs={[
          { label: 'All SKUs', value: 'all' },
          { label: 'Low Stock', value: 'low_stock' },
          { label: 'Sold Out', value: 'out_of_stock' },
          { label: 'POD On-Demand', value: 'pod on-demand' },
        ]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    </div>
  );
};
