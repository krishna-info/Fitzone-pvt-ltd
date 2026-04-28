'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, ShieldCheck, MessageCircle, ChevronRight, CheckCircle, Truck } from 'lucide-react';
import { Product } from '@/lib/product-types';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { ProductCard } from '@/components/sections/ProductCard';
import useEmblaCarousel from 'embla-carousel-react';

export function ProductDetailClient({ 
  product,
  relatedProducts = []
}: { 
  product: Product;
  relatedProducts?: Product[];
}) {
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [emblaRef, emblaApi] = useEmblaCarousel();
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size first');
      return;
    }
    setError('');
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price_inr || 0,
      imageUrl: product.images[0],
      isEnquiryOnly: product.is_enquiry_only,
      size: selectedSize,
      category: product.category_slug
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi FitZone, I'd like to enquire about a BULK ORDER for: *${product.name}*\n\nMy requirement is above the MOQ of ${product.moq} pcs.\n\nPlease share wholesale pricing. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };


  const [activeTab, setActiveTab] = useState<'features' | 'specs'>('features');

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brand-muted mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/products" className="hover:text-brand-dark transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <Link href={`/products/${product.category_slug}`} className="hover:text-brand-dark transition-colors">{product.category}</Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-brand-dark font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="relative rounded-brand-lg overflow-hidden bg-gray-50 aspect-square shadow-inner">
              <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="flex h-full">
                  {product.images.map((img, i) => (
                    <div key={i} className="flex-[0_0_100%] relative h-full">
                      <Image
                        src={`${img}&auto=format&fit=crop&w=1000`}
                        alt={`${product.name} - Image ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {product.images.length > 1 && (
                <>
                  <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-card flex items-center justify-center hover:bg-white transition-all">
                    <ChevronLeft className="w-5 h-5 text-brand-dark" />
                  </button>
                  <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-card flex items-center justify-center hover:bg-white transition-all">
                    <ChevronRight className="w-5 h-5 text-brand-dark" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className="relative w-24 h-24 flex-shrink-0 rounded-brand overflow-hidden border-2 border-transparent hover:border-brand-primary transition-all active:scale-95"
                  >
                    <Image src={`${img}&auto=format&fit=crop&w=200`} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">New Arrival</span>
                <span className="text-brand-muted text-xs font-bold uppercase tracking-widest">{product.category}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-brand-dark leading-none">{product.name}</h1>
              
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-brand-primary">
                  {product.is_enquiry_only ? 'Price on Enquiry' : `₹${product.price_inr?.toLocaleString()}`}
                </span>
                {!product.is_enquiry_only && (
                  <span className="text-sm text-brand-muted mb-1 font-medium">Incl. all taxes</span>
                )}
                <div className="ml-auto bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full border border-brand-primary/20">
                  <span className="text-[10px] font-black uppercase tracking-widest">MOQ: {product.moq} Units</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-brand-dark">Premium Quality</p>
                    <p className="text-brand-muted italic">Guaranteed durability</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center">
                    <Truck className="w-5 h-5 text-brand-secondary" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-brand-dark">Fast Dispatch</p>
                    <p className="text-brand-muted italic">Within 48 hours</p>
                  </div>
               </div>
            </div>

            <p className="text-brand-muted leading-relaxed text-lg">{product.description}</p>

            <div className="space-y-4">
               {/* Selection for Sizes (Standard B2C UI) */}
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Select Size (IN)</label>
                    {error && <span className="text-red-500 text-[10px] font-bold uppercase animate-pulse">{error}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <button 
                        key={size} 
                        onClick={() => {
                          setSelectedSize(size);
                          setError('');
                        }}
                        className={`w-12 h-12 border-2 rounded-brand font-bold text-sm transition-all ${
                          selectedSize === size 
                            ? 'border-brand-primary bg-brand-primary text-white shadow-float scale-105' 
                            : 'border-gray-100 text-brand-muted hover:border-brand-primary hover:text-brand-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    variant="primary" 
                    size="xl" 
                    className="flex-1 font-bold h-16 text-lg shadow-float" 
                    onClick={handleAddToCart}
                    disabled={product.is_enquiry_only}
                  >
                    {added ? (
                      <><CheckCircle className="w-6 h-6 mr-2" /> Added to Cart!</>
                    ) : (
                      <><ShoppingBag className="w-6 h-6 mr-2" /> {product.is_enquiry_only ? 'Price on Enquiry' : 'Add to Cart'}</>
                    )}
                  </Button>
                  <Button variant="outline" size="xl" className="flex-1 font-bold h-16 text-lg" onClick={handleWhatsApp}>
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Bulk Order?
                  </Button>
               </div>
            </div>

            {/* Features & Specs Tabs */}
            <div className="pt-12 space-y-6">
               <div className="flex border-b border-gray-100">
                  <button 
                    onClick={() => setActiveTab('features')}
                    className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'features' ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-dark'}`}
                  >
                    Features
                    {activeTab === 'features' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('specs')}
                    className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'specs' ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-dark'}`}
                  >
                    Specifications
                    {activeTab === 'specs' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
                  </button>
               </div>

               <div className="min-h-[200px]">
                  {activeTab === 'features' ? (
                    <motion.ul 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-3"
                    >
                      {(product.features || [
                        'Premium breathable fabric for max comfort',
                        'Reinforced stitching for high-intensity use',
                        'Anti-odor and moisture-wicking technology',
                        'Ethically manufactured in India',
                        'Modern athletic fit that contours the body'
                      ]).map((feat, i) => (
                        <li key={i} className="flex gap-3 text-brand-muted text-sm italic">
                          <CheckCircle className="w-5 h-5 text-brand-secondary flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </motion.ul>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="bg-brand-surface rounded-brand-lg p-6"
                    >
                      <dl className="space-y-4 divide-y divide-gray-100">
                        {Object.entries(product.specifications || {
                          'Material': '88% Polyester, 12% Spandex',
                          'Fit': 'Athletic / Slim Fit',
                          'Care': 'Machine wash cold, tumble dry low',
                          'Origin': 'Made in India',
                          'Occasion': 'Gym, Running, Athletics'
                        }).map(([key, val]) => (
                          <div key={key} className="flex justify-between py-3">
                            <dt className="text-xs font-bold text-brand-muted uppercase tracking-widest">{key}</dt>
                            <dd className="text-sm font-bold text-brand-dark">{val}</dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  )}
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products Gallery */}
      {relatedProducts.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-brand-dark tracking-tight">You May Also Like</h2>
              <p className="text-brand-muted italic">Curated essentials for your athletic journey</p>
            </div>
            <Link href="/products" className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1 group">
              View All Products <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 shadow-2xl safe-area-bottom">
         <div className="flex gap-4 max-w-lg mx-auto">
            <div className="flex-shrink-0">
               <p className="text-[10px] text-brand-muted font-bold uppercase">Price</p>
               <p className="text-lg font-black text-brand-primary">
                 {product.is_enquiry_only ? 'Enquiry' : `₹${product.price_inr?.toLocaleString()}`}
               </p>
            </div>
            <Button 
              variant="primary" 
              className="flex-1 font-bold h-12" 
              onClick={handleAddToCart}
              disabled={product.is_enquiry_only}
            >
              {added ? 'Added!' : 'Add to Cart'}
            </Button>
         </div>
      </div>
    </div>
  );
}
