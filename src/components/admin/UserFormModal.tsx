'use client';

import React, { useState } from 'react';
import { UserPlus, Edit2, Mail, Lock, User, Shield, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { createUser, updateUser } from '@/app/admin/users/actions';
import { Profile } from '@/types/admin';

interface UserFormModalProps {
  existingUser?: Profile;
}

export function UserFormModal({ existingUser }: UserFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const isEditing = !!existingUser;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEditing) {
        await updateUser(existingUser.id, {
          full_name: formData.get('full_name') as string,
          role: formData.get('role') as string
        });
      } else {
        await createUser(formData);
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={isEditing ? 'Edit User' : 'Add New User'}
      description={isEditing ? `Update details for ${existingUser.full_name}` : 'Create a new admin or regular user account for the platform.'}
      trigger={
        isEditing ? (
          <button className="p-2 rounded-lg hover:bg-gray-100 text-brand-muted transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-brand-dark font-black text-sm hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
            <UserPlus className="w-5 h-5" /> Add User
          </button>
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-4">
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 p-4 rounded-xl text-xs text-red-600 font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input 
                name="full_name"
                defaultValue={existingUser?.full_name || ''}
                required
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-brand-primary outline-none bg-gray-50/50 text-sm"
              />
            </div>
          </div>

          {/* Email (Disabled on Edit) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input 
                name="email"
                type="email"
                defaultValue={existingUser?.email}
                disabled={isEditing}
                required
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-brand-primary outline-none bg-gray-50/50 text-sm disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password (Only on Create) */}
          {!isEditing && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input 
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-brand-primary outline-none bg-gray-50/50 text-sm"
                />
              </div>
            </div>
          )}

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest pl-1">User Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <select 
                name="role"
                defaultValue={existingUser?.role || 'user'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-brand-primary outline-none bg-gray-50/50 text-sm appearance-none"
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading} className="w-full h-14 bg-brand-dark text-white rounded-2xl hover:bg-brand-primary transition-colors">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                {isEditing ? 'Updating User...' : 'Creating User Account...'}
              </span>
            ) : (
              isEditing ? 'Save Changes' : 'Create Account'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
