'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to delete product via API.');
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`p-3 bg-white rounded-xl text-red-600 hover:bg-red-50 transition-colors shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
