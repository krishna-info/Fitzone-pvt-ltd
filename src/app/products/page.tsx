import { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { parseProduct, Product } from '@/lib/products';
import ProductsClient from '@/components/pages/ProductsClient';

export const metadata: Metadata = {
  title: 'Our Products | FitZone Apparels',
  description: 'Explore our range of athletic wear specializations, from performance t-shirts to track pants and jackets.',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string; page?: string };
}) {
  const currentCategory = searchParams.category || 'all';
  const requestedPage = Math.max(1, Number(searchParams.page) || 1);
  const limit = 12;

  let products: Product[] = [];
  let totalProducts = 0;
  let effectivePage = requestedPage;

  try {
    const db = getDb();
    if (db) {
      if (currentCategory !== 'all') {
        const { results: countRes } = await db
          .prepare('SELECT COUNT(*) as count FROM products WHERE category_slug = ? AND is_active = 1')
          .bind(currentCategory)
          .all();
        totalProducts = (countRes[0]?.count as number) || 0;
      } else {
        const { results: countRes } = await db
          .prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1')
          .all();
        totalProducts = (countRes[0]?.count as number) || 0;
      }

      const calculatedTotalPages = Math.max(1, Math.ceil(totalProducts / limit));
      effectivePage = Math.min(requestedPage, calculatedTotalPages);
      const offset = (effectivePage - 1) * limit;

      if (currentCategory !== 'all') {
        const { results } = await db
          .prepare('SELECT * FROM products WHERE category_slug = ? AND is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?')
          .bind(currentCategory, limit, offset)
          .all();
        products = (results || []).map(parseProduct);
      } else {
        const { results } = await db
          .prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?')
          .bind(limit, offset)
          .all();
        products = (results || []).map(parseProduct);
      }
    }
  } catch (error) {
    console.error('Failed to fetch products on ProductsPage:', error);
  }

  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));

  return (
    <ProductsClient 
      products={products}
      totalProducts={totalProducts}
      currentCategory={currentCategory}
      currentPage={effectivePage}
      totalPages={totalPages}
    />
  );
}
