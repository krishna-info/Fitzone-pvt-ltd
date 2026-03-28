import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Package, Search } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';

export const metadata: Metadata = {
  title: 'Products | FitZone Admin',
};

export default async function ProductsManagementPage() {
  const supabase = createSupabaseServerClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error.message);
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
            <h1 className="text-3xl font-black text-white tracking-tight">Product Catalogue</h1>
          </div>
          <ProductFormModal />
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
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none bg-white text-sm"
              />
            </div>
            <div className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-brand-dark flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-primary" />
              {products?.length || 0} Products Total
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden group hover:border-brand-primary/20 hover:shadow-float transition-all relative">
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>

                    <div className="aspect-[4/5] relative bg-gray-50">
                       <Image 
                         src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780'} 
                         alt={product.name} 
                         fill 
                         className="object-cover group-hover:scale-110 transition-transform duration-500"
                       />
                       <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3 z-20">
                          <ProductFormModal product={product} />
                          <DeleteProductButton id={product.id} name={product.name} />
                       </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="font-bold text-brand-dark line-clamp-1">{product.name}</h3>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                         <p className="text-xl font-black text-brand-dark">₹{product.price_inr?.toLocaleString() || '—'}</p>
                         <p className="text-[10px] font-bold text-brand-muted italic">MOQ: {product.moq}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                    <Package className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark">Catalogue is empty</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
