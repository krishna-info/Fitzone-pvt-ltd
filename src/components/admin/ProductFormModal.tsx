'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PRODUCT_CATEGORIES } from '@/lib/product-types';
import { Button } from '@/components/ui/Button';
import { updateProduct, createProduct } from '@/app/admin/products/actions';
import { Modal } from '@/components/ui/Modal';
import { Edit, Plus } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
}

interface SpecItem {
  key: string;
  value: string;
}

function ensureStringArray(val: any, fallback: string[] = []): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // return fallback
    }
  }
  return fallback;
}

function parseSpecsToItems(specifications?: Record<string, string>): SpecItem[] {
  if (!specifications) return [];
  return Object.entries(specifications)
    .filter(([k]) => !k.startsWith('_'))
    .map(([key, value]) => ({ key, value }));
}

export function ProductFormModal({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const [existingImages, setExistingImages] = useState<string[]>(() => ensureStringArray(product?.images, []));
  const [colors, setColors] = useState<string[]>(() => ensureStringArray(product?.colors, ['Black', 'Navy', 'Heather Gray', 'White']));
  const [sizes, setSizes] = useState<string[]>(() => ensureStringArray(product?.sizes, ['S', 'M', 'L', 'XL', 'XXL']));
  const [features, setFeatures] = useState<string[]>(() => ensureStringArray(product?.features, []));
  const [specs, setSpecs] = useState<SpecItem[]>(() => parseSpecsToItems(product?.specifications));

  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const isEdit = !!product;

  React.useEffect(() => {
    if (open) {
      setExistingImages(ensureStringArray(product?.images, []));
      setColors(ensureStringArray(product?.colors, ['Black', 'Navy', 'Heather Gray', 'White']));
      setSizes(ensureStringArray(product?.sizes, ['S', 'M', 'L', 'XL', 'XXL']));
      setFeatures(ensureStringArray(product?.features, []));
      setSpecs(parseSpecsToItems(product?.specifications));
      setNewColor('');
      setNewSize('');
      setNewFeature('');
      setNewSpecKey('');
      setNewSpecValue('');
    }
  }, [open, product]);

  const removeImage = (indexToRemove: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== indexToRemove));
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (colorToRemove: string) => {
    setColors(colors.filter(c => c !== colorToRemove));
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(f => f !== featureToRemove));
  };

  const addSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecs([...specs.filter(s => s.key !== newSpecKey.trim()), { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpec = (keyToRemove: string) => {
    setSpecs(specs.filter(s => s.key !== keyToRemove));
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
      formData.append('colors', JSON.stringify(colors));
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('features', JSON.stringify(features));

      const specsObj: Record<string, string> = {};
      specs.forEach(s => {
        if (s.key.trim() && s.value.trim()) {
          specsObj[s.key.trim()] = s.value.trim();
        }
      });
      formData.append('specifications', JSON.stringify(specsObj));
      
      if (isEdit) {
        await updateProduct(formData);
      } else {
        await createProduct(formData);
      }
      
      setOpen(false);
      router.refresh();
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
      <form 
        key={open ? (product?.id || 'new_form') : 'closed_form'}
        onSubmit={handleSubmit} 
        className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide"
      >
        {isEdit && <input type="hidden" name="id" value={product.id} />}
        
        {/* Name & Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Product Name</label>
            <input 
              name="name" 
              required 
              defaultValue={product?.name || ''} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Slug</label>
            <input 
              name="slug" 
              placeholder="performance-tshirt"
              defaultValue={product?.slug || ''} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        {/* Price & MOQ */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Price (INR)</label>
            <input 
              name="price_inr" 
              type="number" 
              step="any"
              required 
              defaultValue={product?.price_inr ?? ''} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">MOQ (pcs)</label>
            <input 
              name="moq" 
              type="number" 
              required 
              defaultValue={product?.moq ?? 50} 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
          </div>
        </div>

        {/* Category, Status & Enquiry Mode */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Category</label>
            <select 
              name="category_slug" 
              required 
              defaultValue={product?.category_slug || 't-shirts-jerseys'} 
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
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
              defaultValue={product ? (product.is_active ? 'true' : 'false') : 'true'}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
            >
              <option value="true">Active</option>
              <option value="false">Draft</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Mode</label>
            <select 
              name="is_enquiry_only" 
              defaultValue={product ? (product.is_enquiry_only ? 'true' : 'false') : 'false'}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm bg-white"
            >
              <option value="false">Purchase</option>
              <option value="true">Enquiry Only</option>
            </select>
          </div>
        </div>

        {/* Images & Public URLs */}
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

        {/* Available Colors Manager */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest block">Available Colors</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {colors.map(color => (
              <span key={color} className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-surface border border-gray-200 text-brand-dark text-xs font-bold rounded-full">
                {color}
                <button type="button" onClick={() => removeColor(color)} className="text-gray-400 hover:text-red-500 font-bold ml-1">✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }}
              placeholder="Add color (e.g. Navy Blue)..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-xs"
            />
            <Button type="button" variant="outline" size="sm" onClick={addColor}>+ Add Color</Button>
          </div>
        </div>

        {/* Available Sizes Manager */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest block">Available Sizes</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {sizes.map(size => (
              <span key={size} className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold rounded-full">
                {size}
                <button type="button" onClick={() => removeSize(size)} className="text-brand-primary/60 hover:text-red-500 font-bold ml-1">✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSize(); } }}
              placeholder="Add size (e.g. 3XL)..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-xs"
            />
            <Button type="button" variant="outline" size="sm" onClick={addSize}>+ Add Size</Button>
          </div>
        </div>

        {/* Key Product Features Manager */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest block">Key Features</label>
          <div className="space-y-1.5 mb-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-800">
                <span>• {feature}</span>
                <button type="button" onClick={() => removeFeature(feature)} className="text-gray-400 hover:text-red-500 font-bold ml-2">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
              placeholder="Add feature (e.g. Moisture-Wicking Fabric)..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-xs"
            />
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>+ Add Feature</Button>
          </div>
        </div>

        {/* Technical Specifications Manager */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest block">Technical Specifications</label>
          <div className="space-y-1.5 mb-2">
            {specs.map((item) => (
              <div key={item.key} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-800">
                <span><strong className="text-brand-dark">{item.key}:</strong> {item.value}</span>
                <button type="button" onClick={() => removeSpec(item.key)} className="text-gray-400 hover:text-red-500 font-bold ml-2">✕</button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              placeholder="Spec Name (e.g. Fabric)"
              className="px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-xs"
            />
            <div className="flex gap-2">
              <input 
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpec(); } }}
                placeholder="Spec Value (e.g. 100% Polyester)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>+ Add Spec</Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Description</label>
          <textarea 
            name="description" 
            rows={3} 
            defaultValue={product?.description || ''} 
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
