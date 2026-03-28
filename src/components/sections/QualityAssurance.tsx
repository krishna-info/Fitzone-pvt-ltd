'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const CHECKS = [
  'Triple-stitch reinforcement on stress points',
  'Stretch and recovery testing for every batch',
  'Color fastness and shrinkage verification',
  'Zero-defect manual inspection for all items',
  'Anti-pilling and moisture-wicking testing',
];

export function QualityAssurance() {
  return (
    <section className="py-24 bg-brand-dark text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold">Never Compromise on <br /><span className="text-brand-secondary">Quality.</span></h2>
            <p className="text-lg text-gray-400">
              Quality is not just a department; it&apos;s our core identity. We implement multi-layered quality checks at every stage—from yarn selection to final packing.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 p-8 md:p-12 rounded-brand-lg border border-white/10 backdrop-blur-sm space-y-6"
          >
            <ul className="space-y-6">
              {CHECKS.map((check, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-brand-secondary flex-shrink-0" />
                  <span className="text-gray-200 font-medium">{check}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
