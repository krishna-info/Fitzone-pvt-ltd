import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts, getProductsByCategory, Product } from '@/lib/products';
import { ProductDetailClient } from '@/components/pages/ProductDetailClient';

interface Props {
  params: { category: string; slug: string };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map(p => ({ category: p.category_slug, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} | FitZone Apparels`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  // Fetch related products (same category)
  const allRelated = await getProductsByCategory(params.category);
  const relatedProducts = allRelated.filter((p: Product) => p.slug !== params.slug).slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
