
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/product-types';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface ProductNativeAdProps {
  product: Product;
  title?: string;
}

export const ProductNativeAd: React.FC<ProductNativeAdProps> = ({ product, title = "Featured Gear" }) => {
  return (
    <div className="my-12 p-1 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[2rem] overflow-hidden shadow-2xl group">
      <div className="bg-white rounded-[1.9rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-primary/10 transition-colors" />
        
        {/* Image Section */}
        <div className="w-full md:w-48 h-48 relative rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
          {product.images && product.images[0] && (
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )}
          <div className="absolute top-2 left-2 px-3 py-1 bg-brand-dark/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            Top Rated
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-brand-primary font-black uppercase text-[10px] tracking-[0.2em]">{product.category}</span>
            <h3 className="text-2xl md:text-3xl font-black text-brand-dark uppercase tracking-tight leading-none italic">
              {product.name}
            </h3>
          </div>
          
          <p className="text-brand-muted text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <Link 
              href={`/products/${product.slug}`}
              className="px-6 py-3 bg-brand-dark text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-brand-primary transition-colors flex items-center gap-2"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            {product.moq && (
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                MOQ: {product.moq} Units
              </span>
            )}
          </div>
        </div>

        {/* Ad Badge */}
        <div className="absolute top-4 right-6 md:right-8">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest border border-gray-100 px-2 py-0.5 rounded">
            Partner Promotion
          </span>
        </div>
      </div>
    </div>
  );
};
