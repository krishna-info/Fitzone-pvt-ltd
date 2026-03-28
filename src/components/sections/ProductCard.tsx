'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Truck } from 'lucide-react';
import { Product } from '@/lib/product-types';
import { Button } from '@/components/ui/Button';

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-brand-lg overflow-hidden shadow-card hover:shadow-float transition-all group border border-gray-100"
    >
      <Link href={`/products/${product.category_slug}/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          <Image
            src={`${product.images[0]}&auto=format&fit=crop&w=600`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.images.length > 1 && (
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              +{product.images.length - 1}
            </span>
          )}
        </div>
      </Link>
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <Link href={`/products/${product.category_slug}/${product.slug}`}>
            <h3 className="font-bold text-brand-dark hover:text-brand-primary transition-colors leading-tight line-clamp-1">{product.name}</h3>
          </Link>
          <div className="flex items-center justify-between">
            <span className="font-black text-brand-primary text-lg">
              {product.is_enquiry_only ? 'Enquiry' : `₹${product.price_inr?.toLocaleString()}`}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-brand-muted uppercase font-bold tracking-tighter">
              <Truck className="w-3 h-3 text-brand-secondary" /> Fast Delivery
            </span>
          </div>
        </div>
        
        <div className="pt-2">
          <Link href={`/products/${product.category_slug}/${product.slug}`}>
            <Button variant="outline" size="sm" className="w-full group-hover:bg-brand-primary group-hover:text-white transition-all">
              View Product
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
