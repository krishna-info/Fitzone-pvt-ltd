import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, FileText, Search, Calendar, User } from 'lucide-react';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { PostFormModal } from '@/components/admin/PostFormModal';
import { DeletePostButton } from '@/components/admin/DeletePostButton';

export const metadata: Metadata = {
  title: 'Blog Management | FitZone Admin',
};

export default async function BlogManagementPage() {
  const supabase = createSupabaseAdminClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error.message);
  }

  return (
    <div className="bg-brand-surface min-h-screen pb-20">
      {/* Header */}
      <div className="bg-brand-dark py-8 px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/admin" className="text-brand-secondary text-sm font-bold flex items-center gap-2 hover:translate-x-1 transition-transform mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight">Blog Management</h1>
          </div>
          <PostFormModal />
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
                placeholder="Search articles..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none bg-white text-sm"
              />
            </div>
            <div className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-brand-dark flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" />
              {posts?.length || 0} Articles Total
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-[1.5rem] border border-gray-100 hover:border-brand-primary/20 hover:shadow-float transition-all group">
                    <div className="w-full md:w-48 h-32 relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image 
                        src={post.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1740'} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            post.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{post.category}</span>
                        </div>
                        <h3 className="text-lg font-black text-brand-dark line-clamp-1 group-hover:text-brand-primary transition-colors">{post.title}</h3>
                        <p className="text-sm text-brand-muted line-clamp-2 mt-2 leading-relaxed">{post.excerpt}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-muted">
                          <User className="w-3 h-3" /> {post.author_name}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-muted">
                          <Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center justify-center gap-3">
                      <PostFormModal post={post} />
                      <DeletePostButton id={post.id} title={post.title} />
                      <Link 
                        href={`/blog/${post.slug}`} 
                        target="_blank"
                        className="p-2 bg-gray-50 rounded-lg text-brand-dark hover:bg-brand-secondary transition-colors border border-gray-100"
                        title="View Post"
                      >
                        <Search className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark">No articles yet</h3>
                  <p className="text-brand-muted mt-2">Start sharing insights with your community.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
