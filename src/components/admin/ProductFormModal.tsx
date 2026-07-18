'use client';

import React, { useState } from 'react';
import { Product, PRODUCT_CATEGORIES } from '@/lib/product-types';
import { Button } from '@/components/ui/Button';
import { updateProduct, createProduct } from '@/app/admin/products/actions';
import { Modal } from '@/components/ui/Modal';
import { Edit, Plus } from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
  product?: Product;
}

export function ProductFormModal({ product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
  const isEdit = !!product;

  const removeImage = (indexToRemove: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const originalFiles = formData.getAll('images') as File[];
      formData.delete('images');
      
      const { convertToWebP } = await import('@/lib/image-client');
      
      for (const file of originalFiles) {
        if (file && file.size > 0) {
          const webpBlob = await convertToWebP(file);
          const newName = file.name.replace(/\.[^/.]+$/, "") + '.webp';
          formData.append('images', webpBlob, newName);
        } else {
          formData.append('images', file);
        }
      }

      const validImages = existingImages.filter(img => img.trim() !== '');
      formData.append('existing_images', JSON.stringify(validImages));
      
      if (isEdit) {
        await updateProduct(formData);
      } else {
        await createProduct(formData);
      }
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
      title={isEdit ? 'Edit Product' : 'Add New Product'}
      description={isEdit ? `Modifying ${product.name}` : 'Fill in the details to add a new product to the catalogue.'}
      trigger={
        isEdit ? (
          <button className="p-3 bg-white rounded-xl text-brand-dark hover:bg-brand-secondary transition-colors shadow-xl">
            <Edit className="w-5 h-5" />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-secondary text-brand-dark text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-lg mx-auto md:mx-0">
            <Plus className="w-5 h-5" /> Add New Product
          </button>
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
        {isEdit && <input type="hidden" name="id" value={product.id} />}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Product Name</label>
            <input 
              name="name" 
              required 
              defaultValue={product?.name} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Slug</label>
            <input 
              name="slug" 
              placeholder="performance-tshirt"
              defaultValue={product?.slug} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Price (INR)</label>
            <input 
              name="price_inr" 
              type="number" 
              required 
              defaultValue={product?.price_inr} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">MOQ (pcs)</label>
            <input 
              name="moq" 
              type="number" 
              required 
              defaultValue={product?.moq || 50} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Category Slug</label>
            <select 
              name="category_slug" 
              required 
              defaultValue={product?.category_slug} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
            >
              {PRODUCT_CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Status</label>
            <select 
              name="is_active" 
              defaultValue={String(product?.is_active ?? true)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
            >
              <option value="true">Active</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Images & Public URLs</label>
          
          <div className="space-y-3">
            {existingImages.map((img, i) => (
              <div key={i} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 border border-gray-300 bg-white">
                  {img ? (
                     /* eslint-disable-next-line @next/next/no-img-element */
                     <img src={img} alt="Product image" className="object-cover w-full h-full" />
                  ) : (
                     <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...existingImages];
                        newImages[i] = e.target.value;
                        setExistingImages(newImages);
                      }}
                      placeholder="Enter public image URL..."
                      className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-sm"
                    />
                    {img && (
                      <a 
                        href={img} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex shrink-0 items-center justify-center px-3 rounded-lg border border-gray-300 bg-white text-gray-500 hover:text-brand-primary transition-colors"
                        title="Open image in new tab"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                    )}
                    <button 
                      type="button" 
                      onClick={() => removeImage(i)}
                      className="flex shrink-0 items-center justify-center px-3 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Remove Image"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Button type="button" variant="outline" onClick={() => setExistingImages([...existingImages, ''])}>
              + Add Image URL
            </Button>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Upload New Files</label>
            <input 
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">Files will be converted to WebP format.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Description</label>
          <textarea 
            name="description" 
            rows={3} 
            defaultValue={product?.description} 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm resize-none"
          />
        </div>

        <Button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? 'Saving Changes...' : (isEdit ? 'Update Product' : 'Create Product')}
        </Button>
      </form>
    </Modal>
  );
}
