'use client';

import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';

export function MissionVision() {
  return (
    <section className="py-24 bg-brand-surface">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-white rounded-brand-lg shadow-card border border-gray-100 flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark">Our Mission</h3>
            <p className="text-brand-muted leading-relaxed">
              To empower athletes by providing premium-quality, high-performance sportswear that combines innovative technology with expert craftsmanship at an accessible price point.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-10 bg-white rounded-brand-lg shadow-card border border-gray-100 flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 bg-brand-secondary text-white rounded-full flex items-center justify-center">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark">Our Vision</h3>
            <p className="text-brand-muted leading-relaxed">
              To become Indias most trusted manufacturer and brand for athletic wear, setting new benchmarks in quality, sustainability, and manufacturing excellence.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
