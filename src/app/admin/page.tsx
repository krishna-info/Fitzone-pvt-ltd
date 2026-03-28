import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, CreditCard, Package, ShoppingBag, MessageCircle, Users, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import { signOut } from './actions';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Admin Dashboard | FitZone Apparels',
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient();

  // Fetch counts and stats
  const [
    { count: enquiriesCount },
    { count: productsCount },
    { data: paymentsData },
    { count: newEnquiriesCount }
  ] = await Promise.all([
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount').eq('status', 'captured'),
    supabase.from('contact_enquiries')
      .select('*', { count: 'exact', head: true })
      .gt('submitted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  ]);

  const totalPayments = (paymentsData || []).reduce((acc, curr) => acc + (curr.amount / 100), 0);

  const STATS = [
    { label: 'Total Enquiries', value: enquiriesCount || 0, icon: FileText, color: 'text-blue-500' },
    { label: 'New (24h)', value: newEnquiriesCount || 0, icon: MessageCircle, color: 'text-green-500' },
    { label: 'Total Revenue', value: `₹${totalPayments.toLocaleString()}`, icon: CreditCard, color: 'text-amber-500' },
    { label: 'Live Products', value: productsCount || 0, icon: Package, color: 'text-purple-500' },
  ];

  const QUICK_LINKS = [
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, description: 'Manage all B2C orders and return requests' },
    { label: 'Users', href: '/admin/users', icon: Users, description: 'Manage admin and customer accounts' },
    { label: 'Enquiries', href: '/admin/enquiries', icon: FileText, description: 'View and manage contact form submissions' },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard, description: 'Track Razorpay payment success/failures' },
    { label: 'Products', href: '/admin/products', icon: Package, description: 'Add, edit, and manage your catalogue' },
  ];

  return (
    <div className="bg-brand-surface min-h-screen">
      <div className="bg-brand-dark py-12 px-8">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/20 rounded-xl">
              <LayoutDashboard className="w-8 h-8 text-brand-secondary" />
            </div>
            <div>
              <p className="text-brand-secondary text-xs font-black uppercase tracking-[0.2em]">FitZone Executive</p>
              <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-8 -mt-8 pb-20 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="bg-white p-7 rounded-[2rem] shadow-card border border-gray-100 flex items-center gap-6 group hover:border-brand-primary/20 transition-colors">
              <div className={`p-4 rounded-2xl bg-gray-50 group-hover:bg-brand-surface transition-colors`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-brand-dark">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Management Section */}
        <div>
          <h2 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-3">
             Store Management
             <div className="h-px flex-1 bg-gray-100" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {QUICK_LINKS.map(link => (
              <Link key={link.label} href={link.href} className="group">
                <div className="bg-white p-8 rounded-[2rem] shadow-card border border-gray-100 h-full flex flex-col justify-between hover:shadow-float transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-gray-50 group-hover:text-brand-primary/10 transition-colors">
                    <link.icon className="w-24 h-24 -mr-8 -mt-8" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-surface flex items-center justify-center text-brand-primary">
                      <link.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-brand-dark text-xl mb-2">{link.label}</h3>
                      <p className="text-sm text-brand-muted leading-relaxed">{link.description}</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-sm font-bold text-brand-primary group-hover:gap-2 transition-all">
                    Open {link.label} <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
