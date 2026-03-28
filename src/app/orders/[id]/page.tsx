import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, ShoppingBag, Clock, Package, CheckCircle2, AlertCircle, MessageSquare, CreditCard } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { ReturnRequestModal } from '@/components/orders/ReturnRequestModal';

export const metadata: Metadata = {
  title: 'Order Status | FitZone Apparels',
};

export default async function OrderLookupPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, images))')
    .eq('id', params.id)
    .single();

  if (error || !order) {
    notFound();
  }

  const isRefundable = order.status === 'delivered' && 
                       (!order.return_status || order.return_status === 'none');

  return (
    <div className="bg-brand-surface min-h-screen pb-20 pt-24">
      <div className="max-w-screen-md mx-auto px-6">
        {/* Breadcrumb */}
        <Link href="/" className="text-brand-muted text-sm font-bold flex items-center gap-2 hover:text-brand-primary transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to Store
        </Link>

        {/* Status Card */}
        <div className="bg-white rounded-[2.5rem] shadow-float border border-gray-100 overflow-hidden">
          <div className="bg-brand-dark p-10 text-center space-y-4">
             <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto">
               <Package className="w-10 h-10 text-brand-secondary" />
             </div>
             <div>
               <p className="text-brand-secondary text-xs font-black uppercase tracking-[0.2em] mb-1">Order Tracking</p>
               <h1 className="text-3xl font-black text-white">ORDER #{order.id.slice(0, 8).toUpperCase()}</h1>
             </div>
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
               <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
               <span className="text-white text-xs font-bold uppercase tracking-widest">{order.status}</span>
             </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Delivery Progress */}
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10" />
              {[
                { label: 'Pending', icon: Clock, active: true },
                { label: 'Processing', icon: Package, active: order.status !== 'pending' },
                { label: 'Shipped', icon: ShoppingBag, active: order.status === 'shipped' || order.status === 'delivered' },
                { label: 'Delivered', icon: CheckCircle2, active: order.status === 'delivered' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`p-3 rounded-full ${step.active ? 'bg-brand-primary text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${step.active ? 'text-brand-dark' : 'text-gray-300'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Items */}
            <div className="space-y-4 pt-4">
               <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest border-b border-gray-50 pb-4">Order Items</h3>
               <div className="divide-y divide-gray-50">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100 text-center">
                           <img src={item.products?.images?.[0]} className="object-cover w-full h-full" alt="" />
                         </div>
                         <div className="text-left">
                           <p className="font-bold text-brand-dark leading-tight">{item.products?.name}</p>
                           <p className="text-xs text-brand-muted">Size: {item.size || 'Standard'} × {item.quantity}</p>
                         </div>
                      </div>
                      <p className="font-black text-brand-dark text-right">₹{item.price_at_time.toLocaleString()}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Totals & Payment */}
            <div className="bg-brand-surface p-8 rounded-3xl space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-brand-muted text-sm font-bold">Payment Method</span>
                 <span className="text-brand-dark text-sm font-black uppercase tracking-widest flex items-center gap-2">
                   <CreditCard className="w-4 h-4 text-brand-primary" /> {order.payment_method}
                 </span>
               </div>
               <div className="flex justify-between items-center pt-4 border-t border-brand-primary/10">
                 <span className="text-lg font-black text-brand-dark">Order Total</span>
                 <span className="text-2xl font-black text-brand-primary tracking-tight">₹{order.total_amount.toLocaleString()}</span>
               </div>
            </div>

            {/* Return Section */}
            {isRefundable ? (
              <div className="pt-8 text-center space-y-6">
                <div className="p-6 bg-red-50 border border-red-100 rounded-3xl space-y-2">
                   <div className="flex items-center justify-center gap-2 text-red-700 font-bold tracking-tight">
                     <AlertCircle className="w-5 h-5" /> 36-48 Hours Return Policy
                   </div>
                   <p className="text-xs text-red-600 leading-relaxed">
                     Not satisfied? You can request a return within 48 hours of delivery. 
                     Refunds are processed to the original payment method or via UPI for COD orders.
                   </p>
                </div>
                <ReturnRequestModal orderId={order.id} isCOD={order.payment_method === 'COD'} />
              </div>
            ) : order.return_status && order.return_status !== 'none' ? (
              <div className="pt-8 p-10 bg-amber-50 border border-amber-100 rounded-3xl text-center space-y-4">
                 <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
                   <MessageSquare className="w-8 h-8" />
                 </div>
                 <div>
                   <h3 className="font-black text-amber-800 text-xl tracking-tight">Return {order.return_status.toUpperCase()}</h3>
                   <p className="text-sm text-amber-700 mt-1">
                     We are processing your request. Refunds typically take 36-48 hours after approval.
                   </p>
                 </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Help Link */}
        <p className="text-center mt-12 text-sm text-brand-muted">
          Need help with your order? <a href="/contact" className="text-brand-primary font-bold hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
