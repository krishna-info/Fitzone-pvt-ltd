'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { upsertPost } from '@/app/admin/blog-actions';
import { Modal } from '@/components/ui/Modal';
import { Edit, Plus } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { PRODUCT_CATEGORIES, Product as ProductType } from '@/lib/product-types';

interface Post {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  image?: string;
  excerpt?: string;
  content?: string;
  is_published?: boolean;
  author_name?: string;
  author_role?: string;
  promo_product_slug?: string;
  promo_category_slug?: string;
}

interface PostFormProps {
  post?: Post;
}

export function PostFormModal({ post }: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Pick<ProductType, 'slug' | 'name' | 'category'>[]>([]);
  const isEdit = !!post;

  // Fetch products for promotion dropdown
  React.useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        const { data } = await supabase
          .from('products')
          .select('slug, name, category')
          .eq('is_active', true)
          .order('name');
        if (data) setAvailableProducts(data);
      };
      fetchProducts();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Auto-generate slug from title if missing
    if (!data.slug && data.title) {
      data.slug = (data.title as string)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }

    try {
      const result = await upsertPost({
        ...data,
        id: post?.id || undefined,
        is_published: data.is_published === 'true',
      });

      if (result.error) throw new Error(result.error);
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={isEdit ? 'Edit Blog Post' : 'Create Guest Post'}
      description={isEdit ? `Modifying "${post.title}"` : 'Share insights, trends, or news with the FitZone community.'}
      trigger={
        isEdit ? (
          <button className="p-2 bg-gray-50 rounded-lg text-brand-dark hover:bg-brand-secondary transition-colors border border-gray-100">
            <Edit className="w-4 h-4" />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-secondary text-brand-dark text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-lg">
            <Plus className="w-5 h-5" /> Write Guest Post
          </button>
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Title</label>
          <input 
            name="title" 
            required 
            defaultValue={post?.title} 
            placeholder="e.g., The Future of Sustainable Athletic Wear"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Category</label>
            <input 
              name="category" 
              required 
              defaultValue={post?.category || 'Trends'} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Status</label>
            <select 
              name="is_published" 
              defaultValue={String(post?.is_published ?? true)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
            >
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Image URL</label>
          <input 
            name="image" 
            required 
            defaultValue={post?.image} 
            placeholder="Unsplash URL or hosted image link"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Excerpt (Brief Summary)</label>
          <textarea 
            name="excerpt" 
            rows={2} 
            required
            defaultValue={post?.excerpt} 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Content (Markdown supported)</label>
          <textarea 
            name="content" 
            rows={8} 
            required
            defaultValue={post?.content} 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm resize-none"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 mt-6 space-y-4">
          <h4 className="text-xs font-black text-brand-dark uppercase tracking-[0.2em]">Promotion Settings</h4>
          <p className="text-[10px] text-brand-muted uppercase font-bold">Specify a product or category to feature in this post.</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Promote Specific Product</label>
              <select 
                name="promo_product_slug" 
                defaultValue={post?.promo_product_slug || ''}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
              >
                <option value="">Auto-select (Based on post topic)</option>
                {availableProducts.map(p => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Promote Category</label>
              <select 
                name="promo_category_slug" 
                defaultValue={post?.promo_category_slug || ''}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
              >
                <option value="">None (Use product selection above)</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 mt-6 space-y-4">
          <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest">Author Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Author Name</label>
              <input 
                name="author_name" 
                required 
                defaultValue={post?.author_name || 'Admin'} 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Author Role</label>
              <input 
                name="author_role" 
                defaultValue={post?.author_role || 'Executive'} 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 shadow-float" disabled={loading}>
          {loading ? 'Saving Post...' : (isEdit ? 'Update Post' : 'Publish Post')}
        </Button>
      </form>
    </Modal>
  );
}
