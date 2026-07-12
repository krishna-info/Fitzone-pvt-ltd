'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { upsertPost } from '@/app/admin/blog-actions';
import { Modal } from '@/components/ui/Modal';
import { Edit, Plus } from 'lucide-react';

import { PRODUCT_CATEGORIES, Product as ProductType } from '@/lib/product-types';
import { getAvailableProducts } from '@/app/admin/blog-actions';

interface Post {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  image?: string;
  excerpt?: string;
  content?: string;
  is_published?: boolean;
  published_at?: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
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
  const [manualUrl, setManualUrl] = useState<string>(post?.image || '');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const isEdit = !!post;

  // Fetch products for promotion dropdown
  React.useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        const data = await getAvailableProducts();
        if (data) setAvailableProducts(data);
      };
      fetchProducts();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const originalFile = formData.get('image') as File | null;
      
      if (originalFile && originalFile.size > 0) {
        formData.delete('image');
        const { convertToWebP } = await import('@/lib/image-client');
        const webpBlob = await convertToWebP(originalFile);
        const newName = originalFile.name.replace(/\.[^/.]+$/, "") + '.webp';
        formData.append('image', webpBlob, newName);
      }

      // Add ID if editing
      if (post?.id) {
        formData.append('id', post.id);
      }

      const result = await upsertPost(formData);
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Title</label>
            <input
              name="title"
              required
              defaultValue={post?.title}
              placeholder="Post Title"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Slug</label>
            <input
              name="slug"
              defaultValue={post?.slug}
              placeholder="Leave empty to auto-generate"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
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
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Publish Date</label>
            <input
              type="datetime-local"
              name="published_at"
              defaultValue={post?.published_at ? (() => {
                const d = new Date(post.published_at);
                return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
              })() : ''}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Image / Public URL</label>
          <div className="flex gap-4 items-start">
            {(filePreview || manualUrl) && (
               <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={filePreview || manualUrl} alt="Preview" className="object-cover w-full h-full" />
               </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="existing_image"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="Enter public image URL..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                />
                {manualUrl && (
                  <a 
                    href={manualUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex shrink-0 items-center justify-center px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:text-brand-primary transition-colors"
                    title="Open image in new tab"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFilePreview(URL.createObjectURL(file));
                    } else {
                      setFilePreview(null);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                />
              </div>
              <p className="text-xs text-gray-500">Select a file to upload (converts to WebP), or paste a public URL.</p>
            </div>
          </div>
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
          <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest">Author Details</h4>
          <div className="grid grid-cols-3 gap-4">
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
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Avatar URL</label>
              <input
                name="author_avatar"
                defaultValue={post?.author_avatar || ''}
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
