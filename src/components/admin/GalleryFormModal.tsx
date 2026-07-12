'use client';

import { useState } from 'react';
import { uploadGalleryImage } from '@/app/admin/gallery/actions';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function GalleryFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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

      const result = await uploadGalleryImage(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    
    setIsLoading(false);
  }

  return (
    <Modal 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      title="Upload Gallery Image"
      trigger={<Button>Add New Image</Button>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
            >
              <option value="Manufacturing">Manufacturing</option>
              <option value="Products">Products</option>
              <option value="Facility">Facility</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image File
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-surface file:text-brand-primary hover:file:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Image will be converted to WebP format.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </form>
      </Modal>
  );
}
