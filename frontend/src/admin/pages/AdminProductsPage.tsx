import React, { useState, useEffect } from 'react';
import {
  Plus,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { DataTable, Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { AdminProduct } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const FALLBACK_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod_1',
    slug: 'core-hoodie-ivory',
    title: 'Core Hoodie — Ivory',
    description: 'Signature heavyweight 420 GSM French Terry hoodie with minimal chest branding.',
    category: 'hoodies',
    basePricePaise: 249900,
    compareAtPricePaise: 299900,
    isActive: true,
    featured: true,
    images: ['/assets/essential-hoodie.png'],
    fabricGsm: 420,
    fabricComposition: '100% Combed Cotton',
    createdAt: '2026-11-19',
    updatedAt: '2026-11-21',
    variants: [
      { id: 'v1', sku: 'VYO-HOOD-IVR-S', size: 'S', color: 'Ivory', pricePaise: 249900, inStock: true },
      { id: 'v2', sku: 'VYO-HOOD-IVR-M', size: 'M', color: 'Ivory', pricePaise: 249900, inStock: true },
      { id: 'v3', sku: 'VYO-HOOD-IVR-L', size: 'L', color: 'Ivory', pricePaise: 249900, inStock: true },
      { id: 'v4', sku: 'VYO-HOOD-IVR-XL', size: 'XL', color: 'Ivory', pricePaise: 249900, inStock: true },
    ],
  },
  {
    id: 'prod_2',
    slug: 'core-hoodie-black',
    title: 'Core Hoodie — Black',
    description: 'Onyx Black heavyweight luxury hoodie engineered for daily durability.',
    category: 'hoodies',
    basePricePaise: 249900,
    compareAtPricePaise: 299900,
    isActive: true,
    featured: true,
    images: ['/assets/essential-hoodie.png'],
    fabricGsm: 420,
    fabricComposition: '100% Combed Cotton',
    createdAt: '2026-11-19',
    updatedAt: '2026-11-21',
    variants: [
      { id: 'v5', sku: 'VYO-HOOD-BLK-S', size: 'S', color: 'Black', pricePaise: 249900, inStock: true },
      { id: 'v6', sku: 'VYO-HOOD-BLK-M', size: 'M', color: 'Black', pricePaise: 249900, inStock: true },
      { id: 'v7', sku: 'VYO-HOOD-BLK-L', size: 'L', color: 'Black', pricePaise: 249900, inStock: true },
      { id: 'v8', sku: 'VYO-HOOD-BLK-XL', size: 'XL', color: 'Black', pricePaise: 249900, inStock: false },
    ],
  },
  {
    id: 'prod_3',
    slug: 'wordmark-tee-rust',
    title: 'Wordmark Tee — Rust',
    description: 'Relaxed drop-shoulder tee with screenprinted high-density chest typography.',
    category: 'tees',
    basePricePaise: 179900,
    compareAtPricePaise: 229900,
    isActive: true,
    featured: false,
    images: ['/assets/vyomik-logo-tee.png'],
    fabricGsm: 240,
    fabricComposition: '100% Organic Cotton',
    createdAt: '2026-11-19',
    updatedAt: '2026-11-21',
    variants: [
      { id: 'v9', sku: 'VYO-TEE-WDM-RST-S', size: 'S', color: 'Rust', pricePaise: 179900, inStock: true },
      { id: 'v10', sku: 'VYO-TEE-WDM-RST-M', size: 'M', color: 'Rust', pricePaise: 179900, inStock: true },
      { id: 'v11', sku: 'VYO-TEE-WDM-RST-L', size: 'L', color: 'Rust', pricePaise: 179900, inStock: true },
    ],
  },
  {
    id: 'prod_4',
    slug: 'element-tee-black',
    title: 'Element Tee — Black',
    description: 'Clean minimalist tee with subtle tonal mountain contour print on the reverse.',
    category: 'tees',
    basePricePaise: 179900,
    compareAtPricePaise: 219900,
    isActive: true,
    featured: false,
    images: ['/assets/oversized-basic-tee.png'],
    fabricGsm: 240,
    fabricComposition: '100% Organic Cotton',
    createdAt: '2026-11-19',
    updatedAt: '2026-11-21',
    variants: [
      { id: 'v12', sku: 'VYO-TEE-ELM-BLK-S', size: 'S', color: 'Black', pricePaise: 179900, inStock: true },
      { id: 'v13', sku: 'VYO-TEE-ELM-BLK-M', size: 'M', color: 'Black', pricePaise: 179900, inStock: true },
      { id: 'v14', sku: 'VYO-TEE-ELM-BLK-L', size: 'L', color: 'Black', pricePaise: 179900, inStock: true },
    ],
  },
];

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [createSubmitting, setCreateSubmitting] = useState<boolean>(false);
  const [createFeedback, setCreateFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState<'hoodies' | 'tees' | 'oversized' | 'accessories'>('hoodies');
  const [newPriceINR, setNewPriceINR] = useState('2499');
  const [newGsm, setNewGsm] = useState('420');
  const [newDescription, setNewDescription] = useState('');
  const [newColors, setNewColors] = useState('Ivory, Black, Rust');

  const fetchLiveProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AdminProduct[] = data.map((p: any) => ({
            id: String(p.id || p.slug),
            slug: p.slug,
            title: p.title || p.name,
            description: p.description || '',
            category: p.category?.includes('hoodie') ? 'hoodies' : 'tees',
            basePricePaise: p.base_price || 249900,
            isActive: p.is_active ?? true,
            featured: Boolean(p.featured),
            images: p.images?.map((im: any) => im.url || im) || ['/assets/essential-hoodie.png'],
            fabricGsm: p.fabric_gsm || 420,
            fabricComposition: p.fabric_composition || '100% Cotton',
            createdAt: p.created_at || '2026-11-20',
            updatedAt: p.updated_at || '2026-11-21',
            variants: (p.variants || []).map((v: any) => ({
              id: String(v.id || v.sku),
              sku: v.sku,
              size: v.size || 'M',
              color: v.color || 'Standard',
              pricePaise: v.price_paise || p.base_price || 249900,
              inStock: v.in_stock ?? true,
            })),
          }));
          setProducts(mapped);
        }
      }
    } catch {
      // keep fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveProducts();
  }, []);

  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setNewSlug(generatedSlug);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug) {
      setCreateFeedback({ type: 'error', message: 'Title and URL slug are mandatory fields.' });
      return;
    }

    setCreateSubmitting(true);
    setCreateFeedback(null);

    const pricePaise = parseInt(newPriceINR, 10) * 100;
    const sizes = ['S', 'M', 'L', 'XL'];
    const colorsList = newColors.split(',').map((c) => c.trim()).filter(Boolean);

    const variantsPayload = sizes.flatMap((sz) =>
      colorsList.map((col) => ({
        sku: `VYO-${newCategory.substring(0, 4).toUpperCase()}-${col.substring(0, 3).toUpperCase()}-${sz}`,
        size: sz,
        color: col,
        price_paise: pricePaise,
        in_stock: true,
      }))
    );

    const payload = {
      slug: newSlug,
      title: newTitle,
      description: newDescription || `${newTitle} crafted for premium daily comfort.`,
      category: newCategory,
      base_price: pricePaise,
      is_active: true,
      fabric_gsm: parseInt(newGsm, 10) || 420,
      variants: variantsPayload,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setCreateFeedback({
          type: 'success',
          message: `Product "${newTitle}" published directly to live catalog.`,
        });
        setTimeout(() => {
          setIsModalOpen(false);
          fetchLiveProducts();
        }, 1200);
      } else {
        const localProduct: AdminProduct = {
          id: `local_${Date.now()}`,
          slug: newSlug,
          title: newTitle,
          description: newDescription,
          category: newCategory,
          basePricePaise: pricePaise,
          isActive: true,
          featured: false,
          images: ['/assets/essential-hoodie.png'],
          fabricGsm: parseInt(newGsm, 10) || 420,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          variants: variantsPayload.map((v, i) => ({
            id: `v_${i}`,
            sku: v.sku,
            size: v.size,
            color: v.color,
            pricePaise: v.price_paise,
            inStock: true,
          })),
        };
        setProducts((prev) => [localProduct, ...prev]);
        setCreateFeedback({
          type: 'success',
          message: `Product "${newTitle}" added to catalog cache.`,
        });
        setTimeout(() => setIsModalOpen(false), 1200);
      }
    } catch {
      setCreateFeedback({
        type: 'error',
        message: 'Could not communicate with backend products API.',
      });
    } finally {
      setCreateSubmitting(false);
    }
  };

  const columns: Column<AdminProduct>[] = [
    {
      key: 'title',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#242321] overflow-hidden shrink-0 flex items-center justify-center">
            {p.images[0] ? (
              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <Layers className="w-4 h-4 text-[#716B63]" />
            )}
          </div>
          <div>
            <div className="font-bold text-[#F4F0E8]">{p.title}</div>
            <div className="text-[11px] text-[#716B63]">/{p.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (p) => <span className="uppercase text-[#A8A29E] font-semibold">{p.category}</span>,
    },
    {
      key: 'basePricePaise',
      header: 'Price (INR)',
      align: 'right',
      render: (p) => (
        <span className="font-bold text-[#F4F0E8]">
          ₹{(p.basePricePaise / 100).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'variants',
      header: 'Variants',
      align: 'center',
      render: (p) => (
        <span className="text-xs text-[#A8A29E] font-medium">
          {p.variants?.length || 0} SKUs
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (p) => <StatusBadge status={p.isActive ? 'in_stock' : 'out_of_stock'} label={p.isActive ? 'ACTIVE' : 'DRAFT'} />,
    },
    {
      key: 'slug',
      header: 'Storefront',
      align: 'right',
      render: (p) => (
        <a
          href={`/product/${p.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C85A2E] hover:underline"
        >
          <span>View</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-montserrat">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-1">
            CATALOG MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F0E8]">
            Product Catalog (PIM)<span className="text-[#C85A2E]">.</span>
          </h1>
          <p className="text-xs text-[#A8A29E] mt-1">
            Manage streetwear styles, GSM specifications, variant matrices & Qikink SKUs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLiveProducts}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#141414] hover:bg-[#1C1A18] border border-[#242321] rounded-xl text-xs font-semibold text-[#D9D1C3] hover:text-[#F4F0E8] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#C85A2E]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product</span>
          </button>
        </div>
      </div>

      {/* Catalog Table */}
      <DataTable
        columns={columns}
        data={products}
        searchKey={(p) => `${p.title} ${p.slug} ${p.category}`}
        searchPlaceholder="Filter products by title, slug, or category..."
      />

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-8 shadow-2xl relative font-montserrat">
            <div className="flex items-center justify-between pb-4 border-b border-[#242321]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A2E]">
                  CATALOG ENTRY
                </span>
                <h3 className="text-xl font-bold text-[#F4F0E8] mt-0.5">New Streetwear Product</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#716B63] hover:text-[#F4F0E8] rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createFeedback && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  createFeedback.type === 'success'
                    ? 'bg-[#162116] border border-[#233823] text-[#86C286]'
                    : 'bg-[#261517] border border-[#48282D] text-[#D47984]'
                }`}
              >
                {createFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#86C286] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#D47984] shrink-0" />
                )}
                <span>{createFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Heavyweight Minimalist Hoodie"
                  className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-sm text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="heavyweight-hoodie"
                    className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Base Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newPriceINR}
                    onChange={(e) => setNewPriceINR(e.target.value)}
                    placeholder="2499"
                    className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] outline-none cursor-pointer"
                  >
                    <option value="hoodies">Hoodies</option>
                    <option value="tees">Tees</option>
                    <option value="oversized">Oversized</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Fabric Weight (GSM)</label>
                  <input
                    type="number"
                    value={newGsm}
                    onChange={(e) => setNewGsm(e.target.value)}
                    placeholder="420"
                    className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
                  Colors (comma separated)
                </label>
                <input
                  type="text"
                  value={newColors}
                  onChange={(e) => setNewColors(e.target.value)}
                  placeholder="Ivory, Black, Rust"
                  className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Crafted from premium 100% combed cotton..."
                  className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl px-4 py-3 text-xs text-[#F4F0E8] placeholder:text-[#716B63] outline-none resize-none transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#0B0B0B] hover:bg-[#1C1A18] border border-[#242321] rounded-xl text-xs font-semibold text-[#A8A29E] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-5 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {createSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Publish to Catalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
