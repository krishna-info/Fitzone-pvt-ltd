'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/product-types';
import { Button } from '@/components/ui/Button';
import { updateProduct, createProduct } from '@/app/admin/products/actions';
import { Modal } from '@/components/ui/Modal';
import { Edit, Plus } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
}

export function ProductFormModal({ product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isEdit = !!product;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEdit) {
        await updateProduct(formData);
      } else {
        // Simple create logic for now, missing images/slug generation in this demo
        const data = Object.fromEntries(formData.entries()) as unknown as Omit<Product, 'id' | 'created_at'>;
        await createProduct({
          ...data,
          images: [], // Needs proper upload logic
          is_active: String(data.is_active) === 'true',
          price_inr: parseInt(String(data.price_inr)),
          moq: parseInt(String(data.moq)) || 1,
        });
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {isEdit && <input type="hidden" name="id" value={product.id} />}
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Product Name</label>
          <input 
            name="name" 
            required 
            defaultValue={product?.name} 
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
          />
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
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Description</label>
          <textarea 
            name="description" 
            rows={4} 
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
