'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deletePost } from '@/app/admin/blog-actions';

interface DeletePostButtonProps {
  id: string;
  title: string;
}

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await deletePost(id);
      if (result.error) throw new Error(result.error);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
