'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/app/admin/products/actions';

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteProduct(id);
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
