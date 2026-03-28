import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, ShoppingBag, Clock, User, CreditCard, Package, AlertCircle } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { OrderActionButtons } from '@/components/admin/OrderActionButtons';

export const metadata: Metadata = {
  title: 'Orders | FitZone Admin',
};

export default async function AdminOrdersPage() {
  const supabase = createSupabaseServerClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error.message);
  }

  return (
    <div className="bg-brand-surface min-h-screen pb-20">
      {/* Header */}
      <div className="bg-brand-dark py-8 px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/admin" className="text-brand-secondary text-sm font-bold flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight">Order Management</h1>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-8 -mt-6">
        <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden">
          {/* List */}
          <div className="divide-y divide-gray-50">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="p-8 hover:bg-brand-surface transition-colors group">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                    <div className="space-y-6 flex-1">
                      {/* Order Status & ID */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-black text-brand-dark flex items-center gap-1.5">
                           <ShoppingBag className="w-4 h-4 text-brand-primary" />
                           ORDER #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <div className="h-4 w-px bg-gray-200 mx-2" />
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                        {order.return_status && order.return_status !== 'none' && (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 animate-pulse`}>
                            Return {order.return_status}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-brand-muted font-medium ml-auto">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Customer Details</p>
                           <h3 className="font-bold text-brand-dark text-lg flex items-center gap-2">
                             <User className="w-4 h-4 text-brand-muted" /> {order.customer_name}
                           </h3>
                           <p className="text-sm text-brand-muted">{order.customer_email}</p>
                           <p className="text-sm text-brand-muted">{order.shipping_address}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Payment & Total</p>
                           <div className="flex items-baseline gap-2">
                             <p className="text-2xl font-black text-brand-dark">₹{order.total_amount.toLocaleString()}</p>
                             <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">
                               via {order.payment_method?.toUpperCase()}
                             </span>
                           </div>
                        </div>
                      </div>

                      {/* Return Details */}
                      {order.return_status === 'requested' && (
                        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl space-y-3">
                           <div className="flex items-center gap-2 text-red-700 font-bold">
                             <AlertCircle className="w-5 h-5" /> Return Requested
                           </div>
                           <p className="text-sm text-red-600"><strong>Reason:</strong> {order.return_reason}</p>
                           {order.refund_upi_id && (
                             <div className="flex items-center gap-2 text-xs font-black text-brand-dark bg-white inline-flex px-3 py-1.5 rounded-lg border border-red-200">
                               REFUND TO UPI: {order.refund_upi_id}
                             </div>
                           )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="w-full lg:w-48">
                      <OrderActionButtons 
                        orderId={order.id} 
                        returnStatus={order.return_status || 'none'} 
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-brand-dark">No orders found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
