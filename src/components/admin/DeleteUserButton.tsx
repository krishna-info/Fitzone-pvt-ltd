'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteUser } from '@/app/admin/users/actions';

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone and will remove their authentication account.`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteUser(userId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`p-2 rounded-lg hover:bg-red-50 text-brand-muted hover:text-red-600 transition-colors disabled:opacity-50`}
      title="Delete User"
    >
      <Trash2 className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
    </button>
  );
}
