'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
}

export function LatestInsightsSection({ posts }: { posts: Post[] }) {
  return (
    <section className="py-24 bg-brand-surface border-y border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4 text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-dark uppercase">Latest <span className="text-brand-primary">Insights</span></h2>
            <p className="text-brand-muted max-w-xl">Stay updated with the latest trends in athletic wear manufacturing and textile innovation.</p>
          </div>
          <Link href="/blog">
            <Button variant="outline">View All Posts</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-brand-lg overflow-hidden shadow-card border border-gray-100 flex flex-col h-full group"
            >
              <Link href={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden">
                <Image 
                  src={post.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200'} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </Link>
              <div className="p-6 flex flex-col flex-grow space-y-3">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{post.category}</span>
                <h3 className="text-lg font-bold text-brand-dark line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-sm text-brand-muted line-clamp-2">{post.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
