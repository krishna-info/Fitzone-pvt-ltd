import { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'FitZone Insights | Manufacturing & Fitness Trends',
  description: 'Explore the latest in athletic wear manufacturing, fabric innovation, and fitness trends from the heart of Rajasthan. FitZone Apparels - Quality Beyond Boundaries.',
  openGraph: {
    title: 'FitZone Insights | Manufacturing & Fitness Trends',
    description: 'Expert insights into high-performance sportswear production and fitness culture.',
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200'],
  },
};

export default async function BlogListingPage() {
  const supabase = createSupabaseAdminClient();
  
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <main className="bg-brand-surface min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-dark py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070')] bg-cover bg-center" />
        </div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 backdrop-blur-sm mb-4">
            <span className="text-brand-secondary text-[10px] font-black uppercase tracking-[0.2em]">Industry Knowledge</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            FitZone <span className="text-brand-secondary">Insights</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Exploring the intersection of advanced manufacturing, textile science, and modern fitness culture in India.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          {posts && posts.length > 0 ? (
            <BlogGrid posts={posts} />
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-2xl font-black text-brand-dark">No insights published yet.</h3>
              <p className="text-brand-muted mt-4">Stay tuned for upcoming articles.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="bg-brand-dark rounded-[3rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/10 blur-[100px] rounded-full -ml-32 -mb-32" />
            
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Stay Ahead of the Curve</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Join our inner circle for exclusive industry reports and early access to new collections.</p>
            </div>
            
            <div className="relative z-10 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your professional email" 
                className="flex-grow px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
              <Button variant="secondary" className="px-10 py-4 h-auto text-[11px] font-black uppercase tracking-widest whitespace-nowrap">Subscribe Now</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
