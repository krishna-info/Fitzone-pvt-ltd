'use client';

import { useState } from 'react';
import { Product } from '@/lib/product-types';
import { ProductCard } from '@/components/sections/ProductCard';
import { Button } from '@/components/ui/Button';

interface ProductListPaginatedProps {
  initialProducts: Product[];
  category: string;
}

export function ProductListPaginated({ initialProducts, category }: ProductListPaginatedProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 12); // Assuming initial page size is 12

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?category=${category}&offset=${products.length}&limit=12`);
      const newProducts = await response.json();
      
      if (newProducts.length < 12) {
        setHasMore(false);
      }
      
      setProducts([...products, ...newProducts]);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {loading ? 'Loading...' : 'Load More Products'}
          </Button>
        </div>
      )}
      
      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
