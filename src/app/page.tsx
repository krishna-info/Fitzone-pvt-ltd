import { HeroSection } from '@/components/sections/HeroSection';
import { TrustBar } from '@/components/sections/TrustBar';
import { AboutSnapshot } from '@/components/sections/AboutSnapshot';
import { ManufacturingProcess } from '@/components/sections/ManufacturingProcess';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { LatestInsightsSection } from '@/components/sections/LatestInsightsSection';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { getLatestProducts } from '@/lib/products';
import Link from 'next/link';

export default async function Home() {
  const supabase = createSupabaseAdminClient();
  
  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, image, category')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  const latestProducts = await getLatestProducts(5);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <AboutSnapshot />
      <ManufacturingProcess />
      
      <GalleryPreview products={latestProducts} />

      <LatestInsightsSection posts={posts || []} />

      {/* CTA Banner Section */}
      <section className="py-20 bg-brand-dark text-white text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">Ready to start your <br /> next project together?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="px-8 py-4 bg-brand-secondary rounded-brand font-bold hover:bg-brand-secondary/90 transition-all text-brand-dark">
              Get an Estimate
            </Link>
            <Link href="/products" className="px-8 py-4 bg-white/10 rounded-brand font-bold hover:bg-white/20 transition-all">
              View Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
