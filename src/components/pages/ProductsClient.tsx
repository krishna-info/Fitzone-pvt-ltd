'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { PRODUCT_CATEGORIES, Product } from '@/lib/product-types';
import { ProductCard } from '@/components/sections/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Filter, Package } from 'lucide-react';

interface ProductsClientProps {
  products?: Product[];
  totalProducts?: number;
  currentCategory?: string;
  currentPage?: number;
  totalPages?: number;
}

export default function ProductsClient({
  products = [],
  totalProducts = 0,
  currentCategory = 'all',
  currentPage = 1,
  totalPages = 1
}: ProductsClientProps) {
  const categoriesList = [
    { name: 'All Products', slug: 'all' },
    ...PRODUCT_CATEGORIES
  ];

  return (
    <div className="bg-brand-surface min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-20 text-center relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 relative z-10 space-y-4">
           <span className="bg-brand-primary/20 text-brand-secondary border border-brand-primary/30 font-bold uppercase tracking-widest text-xs px-4 py-1.5 rounded-full inline-block">
             Catalogue & Specializations
           </span>
           <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight">
             FitZone <span className="text-brand-secondary">Products</span>
           </h1>
           <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">
             &ldquo;High-performance athletic apparel engineered for bulk and custom manufacturing.&rdquo;
           </p>
        </div>
      </section>

      {/* Sticky Category Filter Session */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-primary flex-shrink-0" />
            <span className="text-xs font-bold text-brand-dark uppercase tracking-widest flex-shrink-0 hidden sm:inline">Categories:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {categoriesList.map(cat => {
              const isActive = currentCategory === cat.slug;
              const href = cat.slug === 'all' ? '/products' : `/products?category=${cat.slug}`;

              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-float scale-105'
                      : 'bg-gray-100 text-brand-muted hover:bg-gray-200 hover:text-brand-dark'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-brand-muted flex-shrink-0">
            <Package className="w-4 h-4 text-brand-primary" />
            <span>{totalProducts} Items</span>
          </div>
        </div>
      </div>

      {/* Products Grid Section */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-8 border-t border-gray-100">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    basePath="/products"
                    category={currentCategory}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-gray-100 shadow-card max-w-2xl mx-auto p-12">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Package className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark">No products found</h3>
              <p className="text-brand-muted text-sm">
                There are currently no active products listed in this category session. Check back soon or browse all categories.
              </p>
              {currentCategory !== 'all' && (
                <Link href="/products" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  View All Products
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Wholesale Banner */}
      <section className="py-20 bg-white border-t border-gray-100">
         <div className="max-w-screen-xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl font-bold text-brand-dark tracking-tight uppercase">Bulk & Private Label Manufacturing</h2>
            <p className="text-brand-muted max-w-2xl mx-auto text-lg leading-relaxed">
               Need custom sizing, custom fabric blends, or brand logos? We offer direct factory wholesale manufacturing for teams and brands.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
               <Link href="/contact" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                  Request Wholesale Quotation
               </Link>
               <Link href="/manufacturing" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                  Explore Manufacturing Facility
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
