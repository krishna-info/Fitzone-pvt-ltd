'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function FacilityOverview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Built for <span className="text-brand-primary">Scale & Precision.</span></h2>
            <p className="text-lg text-brand-muted leading-relaxed">
              Our Haryana-based manufacturing facility is equipped with the latest garment-making machinery, specialized for high-performance athletic wear. We maintain strict environmental and safety standards to ensure a sustainable production environment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
               <div className="p-4 bg-brand-surface rounded-brand border border-gray-100">
                  <h4 className="font-bold text-brand-dark">Modern Machinery</h4>
                  <p className="text-sm text-brand-muted">Automated cutting and high-speed stitching machines.</p>
               </div>
               <div className="p-4 bg-brand-surface rounded-brand border border-gray-100">
                  <h4 className="font-bold text-brand-dark">Skilled Workforce</h4>
                  <p className="text-sm text-brand-muted">Experienced craftsmen with decades of expertise.</p>
               </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
             <div className="aspect-[3/4] rounded-brand-lg overflow-hidden relative shadow-card">
                <Image 
                  src="https://images.unsplash.com/photo-1558444479-f8f53994c341?q=80&w=2070&auto=format&fit=crop" 
                  alt="Factory Floor"
                  fill
                  className="object-cover"
                />
             </div>
             <div className="aspect-[3/4] rounded-brand-lg overflow-hidden relative shadow-card mt-8">
                <Image 
                   src="https://images.unsplash.com/photo-1504198266287-1659872e6590?q=80&w=2070&auto=format&fit=crop" 
                   alt="Stitching Unit"
                   fill
                   className="object-cover"
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
