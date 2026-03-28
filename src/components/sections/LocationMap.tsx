'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-brand-muted">Loading Map...</div>
});

export function LocationMap() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center space-y-4">
          <h2 className="text-3xl font-bold text-brand-dark">Find Us In Haryana</h2>
          <p className="text-brand-muted">Visit our facility to see excellence in action.</p>
        </div>
        
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="w-full h-[500px] rounded-brand-lg overflow-hidden shadow-card relative border border-gray-100"
        >
          <LeafletMapInner 
            lat={29.1492} 
            lng={75.7217} 
            popupText="FitZone Apparels Pvt. Ltd., Haryana, India" 
          />
        </motion.div>
      </div>
    </section>
  );
}
