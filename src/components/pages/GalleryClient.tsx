'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/db';

const DEFAULT_CATEGORIES = ['All', 'Manufacturing', 'Products', 'Facility'];

export default function GalleryClient({ images = [] }: { images?: GalleryImage[] }) {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const safeImages = images || [];

  // Extract unique categories from db + defaults
  const categoriesSet = new Set(DEFAULT_CATEGORIES);
  safeImages.forEach(img => {
    if (img?.category) categoriesSet.add(img.category);
  });
  const CATEGORIES = Array.from(categoriesSet);

  const filteredImages = filter === 'All' 
    ? safeImages 
    : safeImages.filter(img => img?.category === filter);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-brand-dark py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-4">
           <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight">Image Gallery</h1>
           <p className="mt-4 text-gray-400 text-lg">A visual journey through our facility and products.</p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 mb-12">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === cat 
                ? 'bg-brand-primary text-white shadow-float' 
                : 'bg-brand-surface text-brand-muted hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredImages.length > 0 ? (
            <motion.div 
               layout
               className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="break-inside-avoid"
                  >
                    <div 
                      className="relative group cursor-pointer rounded-brand-lg overflow-hidden border border-gray-100 shadow-card"
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image 
                        src={img.image_url}
                        alt={img.title}
                        width={600}
                        height={800}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                         <span className="text-brand-secondary text-xs uppercase font-bold tracking-widest">{img.category}</span>
                         <h3 className="text-white font-bold">{img.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-20 text-center text-brand-muted">
              <p className="text-xl font-medium">No images found in this gallery category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal (Custom Triggervess) */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedImage(null)}
               className="absolute inset-0 bg-brand-dark/95 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative z-[101] max-w-5xl w-full bg-black rounded-brand-lg overflow-hidden shadow-float"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-[102] w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
              <div className="aspect-video relative">
                 <Image 
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                 />
              </div>
              <div className="p-6 bg-brand-dark text-center border-t border-white/10">
                 <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
                 <p className="text-brand-muted">{selectedImage.category}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
