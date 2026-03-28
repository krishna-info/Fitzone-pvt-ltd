'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, MessageCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export function ShoppingCart() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, openCart, closeCart, removeItem, updateQuantity, clearCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const hasEnquiryOnlyItems = items.some(item => item.isEnquiryOnly);

  const handleSendEnquiry = () => {
    const lines = items.map(
      item => `• ${item.name} (${item.category}) — Qty: ${item.quantity}`
    );
    const message = encodeURIComponent(
      `Hi FitZone, I'd like to enquire about a BULK ORDER for:\n\n${lines.join('\n')}\n\nPlease share availability and pricing. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
    closeCart();
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={openCart}
        aria-label="Open shopping cart"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-brand-primary text-white rounded-full shadow-float flex items-center justify-center hover:bg-brand-dark transition-colors"
      >
        <ShoppingBag className="w-6 h-6" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-secondary text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Slide-in Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-[70] w-full max-w-sm bg-white shadow-float flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-brand-dark text-lg">Your Cart</h2>
                <p className="text-xs text-brand-muted">{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>
              </div>
              <button onClick={closeCart} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-brand-muted" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200" />
                  <p className="text-brand-muted font-medium">Your cart is empty.</p>
                  <p className="text-sm text-gray-400">Discover our collection and bring home the best of FitZone.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.productId} className="bg-brand-surface rounded-brand p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                       <div className="flex gap-3">
                         {item.imageUrl && (
                           <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden relative flex-shrink-0">
                             <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                           </div>
                         )}
                         <div>
                          <p className="font-semibold text-brand-dark text-sm leading-tight">{item.name}</p>
                          <p className="text-[10px] text-brand-muted uppercase tracking-wider mt-1">{item.category}</p>
                          <p className="text-sm font-bold text-brand-primary mt-1">
                            {item.price ? `₹${item.price.toLocaleString()}` : 'Price on Enquiry'}
                          </p>
                         </div>
                       </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-brand-primary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-brand-primary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-brand-dark">
                        {item.price ? `₹${(item.price * item.quantity).toLocaleString()}` : '-'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="font-bold text-brand-dark italic">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-brand-muted italic">Tax and shipping calculated at checkout.</p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full font-bold"
                    onClick={handleCheckout}
                    disabled={hasEnquiryOnlyItems}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-brand-muted uppercase tracking-widest font-bold">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <button
                    onClick={handleSendEnquiry}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-brand-secondary hover:text-brand-secondary/80 transition-colors py-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Bulk/Wholesale Enquiry
                  </button>
                </div>

                <button
                  onClick={clearCart}
                  className="w-full text-[10px] text-brand-muted hover:text-brand-dark transition-colors uppercase tracking-widest"
                >
                  Clear all items
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
