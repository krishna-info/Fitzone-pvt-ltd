'use client';

import { useState } from 'react';
import { uploadGalleryImage } from '@/app/admin/gallery/actions';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function GalleryFormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const originalFile = formData.get('image') as File | null;
      
      if (manualUrl) {
        formData.append('manual_url', manualUrl);
      }

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image / Public URL
            </label>
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
                    name="manual_url"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    placeholder="Enter public image URL..."
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none text-sm"
                  />
                  {manualUrl && (
                    <a 
                      href={manualUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex shrink-0 items-center justify-center px-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 hover:text-brand-primary transition-colors"
                      title="Open image in new tab"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  )}
                </div>
                <input
                  type="file"
                  id="image"
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
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-surface file:text-brand-primary hover:file:bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Select a file (converts to WebP) or paste a URL.</p>
              </div>
            </div>
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
