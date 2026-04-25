import { Metadata } from 'next';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ChevronLeft } from 'lucide-react';
import { ProductNativeAd } from '@/components/blog/ProductNativeAd';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createSupabaseAdminClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, image')
    .eq('slug', params.slug)
    .single();

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | FitZone Insights`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const supabase = createSupabaseAdminClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('is_published', true);

  return (posts || []).map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createSupabaseAdminClient();

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch recent posts for sidebar
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, slug, title, image, published_at')
    .eq('is_published', true)
    .neq('slug', params.slug)
    .order('published_at', { ascending: false })
    .limit(3);

  // Fetch a related product for the "Ad"
  const { data: promoProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  // Determine which product to promote
  let promoProduct = null;

  if (post.promo_product_slug) {
    // 1. Priority: Specific manual product selection
    promoProduct = promoProducts?.find(p => p.slug === post.promo_product_slug);
  } 
  
  if (!promoProduct && post.promo_category_slug) {
    // 2. Priority: Specific category selection
    const categoryProducts = promoProducts?.filter(p => p.category_slug === post.promo_category_slug);
    if (categoryProducts && categoryProducts.length > 0) {
      promoProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
    }
  }

  if (!promoProduct) {
    // 3. Fallback: Automatic keyword matching or random
    promoProduct = promoProducts?.find(p => 
      p.category.toLowerCase().includes(post.category.toLowerCase()) ||
      post.category.toLowerCase().includes(p.category.toLowerCase())
    ) || (promoProducts ? promoProducts[Math.floor(Math.random() * promoProducts.length)] : null);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.published_at,
    "author": {
      "@type": "Person",
      "name": post.author_name,
    },
    "publisher": {
      "@type": "Organization",
      "name": "FitZone Apparels",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fitzoneapparel.in/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://fitzoneapparel.in/blog/${post.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-white min-h-screen">
        {/* Article Header */}
        <header className="relative w-full h-[50vh] min-h-[400px] flex items-end">
          <div className="absolute inset-0">
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-screen-xl mx-auto px-4 pb-12 w-full">
            <Link href="/blog" className="inline-flex items-center text-brand-secondary hover:text-white transition-colors mb-6 font-semibold uppercase text-sm tracking-widest">
              <ChevronLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
            <div className="space-y-4 max-w-4xl">
              <span className="bg-brand-primary text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase tracking-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-gray-300 gap-6 pt-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-brand-secondary" />
                  {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center">
                  {post.author_avatar && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3 border border-white/20">
                      <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm">{post.author_name}</p>
                    <p className="text-xs text-gray-400">{post.author_role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <section className="py-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-brand-dark prose-headings:font-extrabold prose-headings:uppercase prose-p:text-brand-muted prose-p:leading-relaxed prose-strong:text-brand-dark prose-li:text-brand-muted"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Internal Promotion (Native Ad Style) */}
                {promoProduct && (
                  <ProductNativeAd product={promoProduct} />
                )}

                {/* Social Share / Tags */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-brand-dark uppercase">Tags:</span>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-brand-surface text-brand-muted text-xs rounded-full">#Manufacturing</span>
                      <span className="px-3 py-1 bg-brand-surface text-brand-muted text-xs rounded-full">#Sportswear</span>
                      <span className="px-3 py-1 bg-brand-surface text-brand-muted text-xs rounded-full">#India</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-12">
                {/* About FitZone */}
                <div className="p-8 bg-brand-dark text-white rounded-brand-lg shadow-float">
                  <h4 className="text-xl font-bold uppercase tracking-tight mb-4">FitZone Manufacturing</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    We are India&apos;s leading high-performance athletic wear manufacturers, combining decades of experience with cutting-edge technology.
                  </p>
                  <Link href="/manufacturing" className="text-brand-secondary font-bold text-sm uppercase tracking-wider hover:underline">
                    Tour Our Facility &rarr;
                  </Link>
                </div>

                {/* Recent Posts (Simplified) */}
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-brand-dark uppercase border-b border-brand-primary pb-2 inline-block">More Insights</h4>
                  <div className="space-y-6">
                    {recentPosts && recentPosts.map(p => (
                      <Link key={p.id} href={`/blog/${p.slug}`} className="group flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-brand overflow-hidden">
                          {p.image && <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform" />}
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-2 text-sm leading-snug">{p.title}</h5>
                          <span className="text-[10px] text-brand-muted uppercase tracking-widest">{new Date(p.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
