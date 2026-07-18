'use client';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/product-types';

interface GalleryPreviewProps {
  products: Product[];
}

export function GalleryPreview({ products }: GalleryPreviewProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-4">
          <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">Our Latest Work</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark uppercase">Product Gallery</h2>
          <p className="text-brand-muted max-w-xl mx-auto italic">Explore our recently manufactured high-performance athletic wear.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product, i) => (
            <div key={product.id} className="flex flex-col gap-2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[3/4] bg-gray-100 rounded-brand overflow-hidden shadow-card hover:shadow-float transition-all relative group"
              >
                <Link href={`/products/${product.category_slug}/${product.slug}`} className="block w-full h-full">
                  <Image 
                    src={product.images?.[0] || ''}
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-left">
                    <p className="text-white text-xs font-bold uppercase truncate">{product.name}</p>
                    <p className="text-brand-secondary text-[10px] font-black tracking-tighter">VIEW DETAILS</p>
                  </div>
                </Link>
              </motion.div>
              <div className="text-left bg-gray-50 p-1.5 rounded border border-gray-100 overflow-hidden whitespace-nowrap text-ellipsis">
                <a 
                  href={product.images?.[0] || '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] text-brand-primary hover:underline font-mono"
                  title="View Original Image"
                >
                  {product.images?.[0] || 'No Image URL'}
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-brand-dark font-bold hover:text-brand-primary transition-colors border-b-2 border-brand-secondary pb-1">
            Browse Full Catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}

