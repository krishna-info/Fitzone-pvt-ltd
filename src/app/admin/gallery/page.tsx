import { getDb } from '@/lib/db';
import { GalleryImage } from '@/lib/db'; // We need to define this type
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import { GalleryFormModal } from '@/components/admin/GalleryFormModal';
import { deleteGalleryImage } from './actions';

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  async function handleDelete(formData: FormData) {
    "use server";
    await deleteGalleryImage(formData);
  }

  const db = getDb();
  
  // Pagination setup
  const page = Number(searchParams?.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  let images: GalleryImage[] = [];
  let totalItems = 0;
  
  try {
    // Fetch gallery images
    const { results } = (await db
      .prepare('SELECT * FROM gallery_images ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all()) as { results: GalleryImage[] };
    images = results || [];

    // Get total count for pagination
    const { results: countResult } = (await db
      .prepare('SELECT COUNT(*) as total FROM gallery_images')
      .all()) as { results: { total: number }[] };
    totalItems = countResult[0]?.total || 0;
  } catch (error: any) {
    console.error('Error fetching gallery images:', error.message);
  }

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500 mt-1">Upload and manage images for the public gallery.</p>
        </div>
        <GalleryFormModal />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {images.map((img) => (
                <tr key={img.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={img.image_url}
                        alt={img.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{img.title}</td>
                  <td className="px-6 py-4 text-gray-500">{img.category}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(img.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={img.id} />
                      <input type="hidden" name="image_url" value={img.image_url} />
                      <button 
                        type="submit" 
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {images.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No images found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <a
              key={pageNum}
              href={`/admin/gallery?page=${pageNum}`}
              className={`px-4 py-2 rounded-md ${
                page === pageNum
                  ? 'bg-brand-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
