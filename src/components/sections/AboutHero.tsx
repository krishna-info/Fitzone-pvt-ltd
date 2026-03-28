'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function AboutHero() {
  return (
    <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-brand-dark overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-dark/60 z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1524275539700-cf51138f679b?q=80&w=2070&auto=format&fit=crop" 
          alt="About FitZone"
          fill
          className="object-cover grayscale opacity-50"
          priority
        />
      </div>
      
      <div className="relative z-20 text-center space-y-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-secondary font-bold uppercase tracking-widest text-sm">Our Story</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">About FitZone</h1>
        </motion.div>
      </div>
    </section>
  );
}
