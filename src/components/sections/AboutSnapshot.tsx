'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export function AboutSnapshot() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark leading-tight">
                Modern Manufacturing, <br />
                <span className="text-brand-primary">Traditional Excellence.</span>
              </h2>
              <div className="w-20 h-1.5 bg-brand-secondary rounded-full" />
            </div>
            
            <p className="text-lg text-brand-muted leading-relaxed">
              Since 2023, FitZone Apparels has been at the forefront of textile innovation in Haryana. We combine state-of-the-art machinery with skilled craftsmanship to produce athletic wear that stands the test of time.
            </p>
            
            <div className="grid grid-cols-2 gap-8 py-4">
              <div>
                <h4 className="text-3xl font-bold text-brand-primary">2+</h4>
                <p className="text-sm text-brand-muted uppercase tracking-wider font-semibold">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-brand-primary">100%</h4>
                <p className="text-sm text-brand-muted uppercase tracking-wider font-semibold">Quality Assured</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/about">
                <Button variant="outline" size="lg">Read Our Story</Button>
              </Link>
              <Link href="/products">
                <Button variant="primary" size="lg">Shop Products</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-brand-lg overflow-hidden shadow-float relative z-10">
               <Image 
                 src="https://images.unsplash.com/photo-1558444479-f8f53994c341?q=80&w=2070&auto=format&fit=crop" 
                 alt="FitZone Manufacturing Facility"
                 fill
                 className="object-cover"
               />
            </div>
            {/* Decorative element */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-surface rounded-full -z-0 opacity-50" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-brand-primary/10 rounded-full -z-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
