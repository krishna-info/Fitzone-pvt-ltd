'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function BrandStory() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Built on Quality, <br /><span className="text-brand-primary">Driven by Performance.</span></h2>
            <div className="prose prose-lg text-brand-muted">
              <p>
                Founded in Haryana, FitZone Apparels Pvt. Ltd. was born out of a passion for excellence in athletic wear. What started as a small manufacturing unit has evolved into a state-of-the-art facility serving clients across the country.
              </p>
              <p>
                Our philosophy is simple: athlete-first design. Every stitch, every fabric choice, and every manufacturing step is optimized to provide maximum comfort and durability for the high-performance lifestyle.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative aspect-video rounded-brand-lg overflow-hidden shadow-card"
          >
             <Image 
               src="https://images.unsplash.com/photo-1593440428582-7429399486c1?q=80&w=2070&auto=format&fit=crop" 
               alt="Our Manufacturing Legacy"
               fill
               className="object-cover"
             />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
