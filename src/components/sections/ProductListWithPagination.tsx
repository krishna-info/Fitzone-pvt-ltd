'use client';

import { useState } from 'react';
import { Product, getProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/components/sections/ProductCard';
import { Button } from '@/components/ui/Button';

interface ProductListProps {
  initialProducts: Product[];
  categorySlug: string;
}

export function ProductListWithPagination({ initialProducts, categorySlug }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 12); // Assuming batch size 12
  const [offset, setOffset] = useState(initialProducts.length);

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?category=${categorySlug}&limit=12&offset=${offset}`);
      const newProducts = await response.json();
      
      if (newProducts.length < 12) {
        setHasMore(false);
      }
      
      setProducts(prev => [...prev, ...newProducts]);
      setOffset(prev => prev + newProducts.length);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button 
            onClick={loadMore} 
            variant="outline" 
            size="lg" 
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? 'Loading...' : 'Load More Products'}
          </Button>
        </div>
      )}
    </div>
  );
}
