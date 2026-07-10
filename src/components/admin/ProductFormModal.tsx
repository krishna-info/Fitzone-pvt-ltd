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
    const formData = new FormData(e.currentTarget);
    formData.append('existing_images', JSON.stringify(existingImages));
    
    try {
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
              required 
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

        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Upload Images</label>
          <input 
            type="file"
            name="images"
            multiple
            accept="image/*"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
          />
          <p className="text-xs text-gray-500">Images will be converted to WebP.</p>
          
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {existingImages.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded overflow-hidden group">
                  <Image src={img} alt="Product image" fill className="object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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
