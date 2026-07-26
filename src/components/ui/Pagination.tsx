import Link from 'next/link';

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  category,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  category?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
        const queryParams = new URLSearchParams();
        if (category && category !== 'all') {
          queryParams.set('category', category);
        }
        queryParams.set('page', pageNum.toString());
        const href = `${basePath}?${queryParams.toString()}`;

        return (
          <Link
            key={pageNum}
            href={href}
            className={`px-4 py-2 rounded-md ${
              currentPage === pageNum
                ? 'bg-brand-primary text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNum}
          </Link>
        );
      })}
    </div>
  );
}
