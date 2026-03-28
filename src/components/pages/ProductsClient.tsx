'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PRODUCT_CATEGORIES } from '@/lib/product-types';

export default function ProductsClient() {
  return (
    <div className="bg-brand-surface min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-4">
           <span className="text-brand-secondary font-bold uppercase tracking-widest text-sm">Our Collection</span>
           <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">Product Categories</h1>
           <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto italic">
             &ldquo;World-class manufacturing for champions.&rdquo;
           </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCT_CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-[400px] rounded-brand-lg overflow-hidden shadow-card hover:shadow-float transition-all"
              >
                <Image 
                  src={`${cat.image}&auto=format&fit=crop&w=600`}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-8 space-y-4">
                   <h3 className="text-2xl font-extrabold text-white tracking-tight uppercase leading-tight">{cat.name}</h3>
                   <Link href={`/products/${cat.slug}`}>
                      <Button variant="secondary" className="w-full sm:w-auto">View Products</Button>
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Info */}
      <section className="py-20 bg-white border-t border-gray-100">
         <div className="max-w-screen-xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl font-bold text-brand-dark tracking-tight">Bulk & Wholesale Enquiries</h2>
            <p className="text-brand-muted max-w-2xl mx-auto text-lg leading-relaxed">
               As a high-capacity manufacturing unit, we specialize in bulk orders, private labeling, and custom designs for sports academies, corporate teams, and retail brands.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
               <Link href="/contact">
                  <Button variant="primary" size="lg">Contact for Wholesale</Button>
               </Link>
               <Link href="/manufacturing">
                  <Button variant="outline" size="lg">Our Process</Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
