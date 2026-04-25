'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1558770147-d2a384e1ad85?q=80&w=800',
  'https://images.unsplash.com/photo-1516762689617-e1cff94b1017?q=80&w=800',
  'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800'
];

export function GalleryPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark uppercase">Our Gallery</h2>
          <p className="text-brand-muted max-w-xl mx-auto italic">A glimpse into our high-precision manufacturing floor and product quality.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((url, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square bg-gray-100 rounded-brand-lg overflow-hidden shadow-card hover:shadow-float transition-all relative group"
            >
              <Image 
                src={url} 
                alt={`Factory gallery ${i+1}`} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
