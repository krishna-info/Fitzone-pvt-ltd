import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, CreditCard, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink, Search, Filter } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Payments | FitZone Admin',
};

export default async function PaymentsPage() {
  const supabase = createSupabaseServerClient();

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*, orders(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error.message);
  }

  return (
    <div className="bg-brand-surface min-h-screen pb-20">
      {/* Header */}
      <div className="bg-brand-dark py-8 px-8">
        <div className="max-w-screen-xl mx-auto">
          <Link href="/admin" className="text-brand-secondary text-sm font-bold flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">Payment Transactions</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-8 -mt-6">
        <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input 
                type="text" 
                placeholder="Search by Payment ID or Order ID..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none bg-white text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-black text-brand-muted uppercase tracking-widest">Transaction Details</th>
                  <th className="px-8 py-5 text-xs font-black text-brand-muted uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-xs font-black text-brand-muted uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-xs font-black text-brand-muted uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-brand-muted uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="group hover:bg-brand-surface transition-colors">
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="font-bold text-brand-dark flex items-center gap-2">
                             <span className="text-brand-muted">#</span>{payment.razorpay_payment_id || 'PENDING'}
                          </p>
                          <p className="text-xs text-brand-muted flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(payment.created_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="font-bold text-brand-dark">{payment.orders?.customer_name || 'Anonymous'}</p>
                          <p className="text-xs text-brand-muted">{payment.orders?.customer_email || '—'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-lg font-black text-brand-dark">₹{(payment.amount / 100).toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {payment.status === 'captured' ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                              <CheckCircle2 className="w-3 h-3" /> Captured
                            </span>
                          ) : payment.status === 'failed' ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                              <XCircle className="w-3 h-3" /> Failed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                              <AlertCircle className="w-3 h-3" /> {payment.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-brand-muted hover:text-brand-primary hover:bg-white rounded-xl transition-all shadow-sm">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                        <CreditCard className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-dark">No transactions found</h3>
                      <p className="text-brand-muted">Payment records will appear here after orders are placed.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
