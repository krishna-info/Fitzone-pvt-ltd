'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Truck, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import Script from 'next/script';

export function CheckoutClient() {
  const [mounted, setMounted] = useState(false);
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 150;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    
    try {
      // 1. Create order on server
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      
      const order = await res.json();
      
      if (!order.id) throw new Error('Failed to create order');

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "FitZone Apparels",
        description: `Order for ${totalItems} items`,
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment on server
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerDetails: formData,
              items: items,
            }),
          });
          
          if (verifyRes.ok) {
            clearCart();
            window.location.href = '/thank-you';
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#0F172A",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">Your cart is empty</h2>
        <Link href="/products">
          <Button variant="primary">Shop Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface min-h-screen">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-6 sm:p-8 rounded-brand-lg shadow-card border border-gray-100">
              <h2 className="text-2xl font-extrabold text-brand-dark mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6 text-brand-primary" />
                Shipping Information
              </h2>
              
              <form id="checkout-form" onSubmit={handlePayment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-brand-dark">Full Name</label>
                  <input 
                    required 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-brand border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" 
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark">Email Address</label>
                  <input 
                    required 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-brand border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" 
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark">Phone Number</label>
                  <input 
                    required 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-brand border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" 
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-brand-dark">Delivery Address</label>
                  <input 
                    required 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-brand border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all" 
                    placeholder="House No, Street, Landmark"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-brand-dark">City</label>
                   <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-brand border border-gray-200 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-brand-dark">Pin Code</label>
                   <input required name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-brand border border-gray-200 outline-none" />
                </div>
              </form>
            </section>

            <div className="flex items-center gap-4 p-4 bg-brand-surface border border-brand-primary/10 rounded-brand text-xs text-brand-muted">
              <ShieldCheck className="w-5 h-5 text-brand-primary flex-shrink-0" />
              <p>Your connection is secure and your data is protected with 256-bit SSL encryption.</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-brand-lg shadow-card border border-gray-100 divide-y divide-gray-100 lg:sticky lg:top-28">
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Order Summary</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="w-16 h-16 bg-brand-surface rounded overflow-hidden flex-shrink-0 relative">
                        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-brand-dark text-sm truncate">{item.name}</p>
                        <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-brand-dark text-sm">₹{( (item.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-lg font-extrabold text-brand-dark pt-2 border-t border-dashed border-gray-200">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6">
                 <Button 
                   type="submit" 
                   form="checkout-form"
                   variant="primary" 
                   size="lg" 
                   className="w-full font-bold h-14 text-lg"
                   disabled={loading}
                 >
                   {loading ? (
                     <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                   ) : (
                     <><CreditCard className="w-5 h-5 mr-2" /> Pay ₹{total.toLocaleString()}</>
                   )}
                 </Button>
                 <p className="text-[10px] text-center text-brand-muted mt-4 uppercase tracking-widest font-bold">
                    SECURE CHECKOUT BY RAZORPAY
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
