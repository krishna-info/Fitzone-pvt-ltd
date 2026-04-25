'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const CATEGORIES = ['All', 'Manufacturing', 'Products', 'Facility'];

const GALLERY_IMAGES = [
  { id: 1, category: 'Manufacturing', title: 'Stitching Unit', src: 'https://images.unsplash.com/photo-1555529669-26f9d103abdd?q=80&w=2070' },
  { id: 2, category: 'Products', title: 'Performance Tracksuit', src: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1920' },
  { id: 3, category: 'Facility', title: 'Rajasthan Warehouse', src: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070' },
  { id: 4, category: 'Manufacturing', title: 'Fabric Cutting', src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2072' },
  { id: 5, category: 'Products', title: 'Compression Shirt', src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070' },
  { id: 6, category: 'Manufacturing', title: 'Quality Check', src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070' },
];


export default function GalleryClient() {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_IMAGES[0] | null>(null);

  const filteredImages = filter === 'All' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === filter);

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
                      src={`${img.src}&auto=format&fit=crop&w=600`}
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
                    src={`${selectedImage.src}&auto=format&fit=contain&w=1200`}
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
