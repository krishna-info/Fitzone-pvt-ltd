import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Users, UserPlus, Search, Filter, Shield, Mail, Calendar, MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { getUsers } from './actions';
import { UserFormModal } from '@/components/admin/UserFormModal';
import { DeleteUserButton } from '@/components/admin/DeleteUserButton';

export const metadata: Metadata = {
  title: 'User Management | FitZone Admin',
};

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="bg-brand-surface min-h-screen pb-20">
      {/* Header */}
      <div className="bg-brand-dark py-8 px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/admin" className="text-brand-secondary text-sm font-bold flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight">User Management</h1>
          </div>
          <UserFormModal />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-8 -mt-6">
        <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none bg-white text-sm"
              />
            </div>
            <div className="flex items-center gap-3 text-center">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4" /> Filter Roles
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto text-center">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">
                  <th className="px-8 py-4">User Details</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Joined At</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-brand-surface transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                            user.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-gray-100 text-brand-muted'
                          }`}>
                            {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-brand-dark text-lg mb-0.5">{user.full_name || 'No Name'}</p>
                            <p className="text-sm text-brand-muted flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                          user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {user.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-brand-dark font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-muted" />
                          {new Date(user.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <UserFormModal existingUser={user} />
                           {user.email !== 'amrit@fitzone.in' && (
                             <DeleteUserButton userId={user.id} userName={user.full_name || user.email} />
                           )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-24 text-center space-y-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Users className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-brand-dark">No users found</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
