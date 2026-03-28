import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCT_CATEGORIES, getProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/components/sections/ProductCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: { category: string };
}

export async function generateStaticParams() {
  return PRODUCT_CATEGORIES.map(cat => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = PRODUCT_CATEGORIES.find(c => c.slug === params.category);
  if (!category) return {};
  return {
    title: `${category.name} | FitZone Apparels`,
    description: `Browse our range of ${category.name.toLowerCase()} for bulk and wholesale orders.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = PRODUCT_CATEGORIES.find(c => c.slug === params.category);
  if (!category) notFound();

  const products = await getProductsByCategory(params.category);

  return (
    <div className="bg-brand-surface min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-16 text-center">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">{category.name}</h1>
          <p className="mt-3 text-gray-400">{products.length} products available</p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-20 text-brand-muted">
              <p className="text-xl font-semibold">Coming Soon</p>
              <p className="mt-2 text-sm">Products in this category will be listed shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
