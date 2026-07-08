import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 ? (
        <Link href={`${basePath}?page=${currentPage - 1}`} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-brand-dark transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <div className="p-2 border border-gray-100 rounded-lg text-gray-300">
          <ChevronLeft className="w-4 h-4" />
        </div>
      )}
      
      <span className="text-sm font-bold text-brand-dark mx-4">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={`${basePath}?page=${currentPage + 1}`} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-brand-dark transition-colors">
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div className="p-2 border border-gray-100 rounded-lg text-gray-300">
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
