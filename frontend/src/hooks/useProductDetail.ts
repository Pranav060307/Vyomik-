import { useState, useEffect } from 'react';
import { SHOP_PRODUCTS, ShopProduct } from '../config/shopProducts';

export interface UseProductDetailResult {
  product: ShopProduct;
  loading: boolean;
  error: string | null;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  setSelectedSize: (size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  quantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  setQuantity: (qty: number) => void;
}

export function useProductDetail(slug?: string): UseProductDetailResult {
  // Default to Core Hoodie – Ivory (vy-prod-01)
  const defaultProduct = SHOP_PRODUCTS[0];

  const [product, setProduct] = useState<ShopProduct>(() => {
    if (!slug) return defaultProduct;
    const found = SHOP_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
    return found || defaultProduct;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState<string>(
    product.swatches[0]?.name || product.colorName || 'Ivory'
  );

  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>(
    product.availableSizes.includes('M') ? 'M' : product.availableSizes[0] || 'M'
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadProduct() {
      // Find fallback from static catalog first
      const fallback =
        SHOP_PRODUCTS.find((p) => p.slug === slug || p.id === slug) || defaultProduct;

      try {
        const response = await fetch(`http://localhost:8000/api/v1/products/${slug || 'core-hoodie-ivory'}`);
        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }
        const apiData = await response.json();
        if (isMounted && apiData) {
          // Merge API data with rich frontend presentation fields
          const merged: ShopProduct = {
            ...fallback,
            name: apiData.name || fallback.name,
            description: apiData.description || fallback.description,
            price: apiData.base_price ? Math.round(apiData.base_price / 100) : fallback.price,
            pricePaise: apiData.base_price || fallback.pricePaise,
          };
          setProduct(merged);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          // Gracefully fallback to static catalog
          setProduct(fallback);
          setError(null); // Silent graceful fallback for robust offline/demo rendering
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Update selectedColor & selectedSize when product changes
  useEffect(() => {
    if (product.swatches && product.swatches.length > 0) {
      setSelectedColor(product.swatches[0].name);
    }
    if (product.availableSizes && product.availableSizes.length > 0) {
      setSelectedSize(
        product.availableSizes.includes('M') ? 'M' : product.availableSizes[0]
      );
    }
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product.id]);

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return {
    product,
    loading,
    error,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    selectedImageIndex,
    setSelectedImageIndex,
    quantity,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
  };
}

