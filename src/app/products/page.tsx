import { Metadata } from 'next';
import ProductsClient from '@/components/pages/ProductsClient';

export const metadata: Metadata = {
  title: 'Our Products | FitZone Apparels',
  description: 'Explore our range of athletic wear specializations, from performance t-shirts to track pants and jackets.',
};

export default function ProductsPage() {
  return <ProductsClient />;
}
