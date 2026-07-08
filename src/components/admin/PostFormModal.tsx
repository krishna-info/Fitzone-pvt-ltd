'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { upsertPost } from '@/app/admin/blog-actions';
import { Modal } from '@/components/ui/Modal';
import { Edit, Plus } from 'lucide-react';

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
}

interface PostFormProps {
  post?: Post;
}

export function PostFormModal({ post }: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isEdit = !!post;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
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
      title={isEdit ? 'Edit Blog Post' : 'Create Post'}
      description={isEdit ? `Modifying "${post.title}"` : 'Write a new article for the FitZone blog.'}
      trigger={
        isEdit ? (
          <button className="p-2 bg-gray-50 rounded-lg text-brand-dark hover:bg-brand-secondary transition-colors border border-gray-100">
            <Edit className="w-4 h-4" />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-secondary text-brand-dark text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-lg">
            <Plus className="w-5 h-5" /> Write Post
          </button>
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
        {isEdit && <input type="hidden" name="id" value={post.id} />}
        
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
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Slug</label>
            <input 
              name="slug" 
              defaultValue={post?.slug} 
              placeholder="Auto-generated if left blank"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Category</label>
            <input 
              name="category" 
              required 
              defaultValue={post?.category || 'Trends'} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Published At</label>
            <input 
              type="datetime-local"
              name="published_at" 
              defaultValue={post?.published_at ? new Date(post.published_at).toISOString().slice(0,16) : ''} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Upload Cover Image</label>
          <input 
            type="file"
            name="image_file" 
            accept="image/*"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
          />
          {post?.image && (
            <div className="mt-2 text-xs text-gray-500">
              Current Image URL: {post.image}
              <input type="hidden" name="existing_image" value={post.image} />
            </div>
          )}
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
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Author Avatar URL</label>
            <input 
              name="author_avatar" 
              defaultValue={post?.author_avatar || ''} 
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-12 shadow-float" disabled={loading}>
          {loading ? 'Saving Post...' : (isEdit ? 'Update Post' : 'Publish Post')}
        </Button>
      </form>
    </Modal>
  );
}
