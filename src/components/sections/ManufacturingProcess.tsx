'use client';

import { motion } from 'framer-motion';
import { Scissors, ClipboardCheck, Package, Truck, Zap, Activity } from 'lucide-react';

const STEPS = [
  { icon: Zap, title: 'Analysis', desc: 'Detailed requirement gathering and design finalization.' },
  { icon: Scissors, title: 'Cutting', desc: 'Precision fabric cutting using advanced machinery.' },
  { icon: Activity, title: 'Stitching', desc: 'Expert craftsmanship joined with high-strength threads.' },
  { icon: ClipboardCheck, title: 'QC Check', desc: 'Multi-layer quality inspections for every unit.' },
  { icon: Package, title: 'Packing', desc: 'Secure and professional packaging for safe transit.' },
  { icon: Truck, title: 'Dispatch', desc: 'Fast and reliable shipping across India.' },
];

export function ManufacturingProcess() {
  return (
    <section className="py-24 bg-brand-surface">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark">How We Work</h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Our streamlined manufacturing process ensures consistency, quality, and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white rounded-brand-lg border border-gray-100 shadow-card hover:shadow-card-hover transition-all text-left space-y-4 flex flex-col items-start"
            >
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark">{index + 1}. {step.title}</h3>
              <p className="text-sm text-brand-muted leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
