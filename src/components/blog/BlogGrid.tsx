'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author_name: string;
  published_at: string;
}

export function BlogGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-card hover:shadow-float transition-all"
        >
          <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
            <Image 
              src={post.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200'}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-6 left-6 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              {post.category}
            </div>
          </Link>
          
          <div className="p-8 flex flex-col flex-grow space-y-4">
            <div className="flex items-center text-[11px] font-bold text-brand-muted uppercase tracking-wider space-x-6">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-primary" /> {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-brand-primary" /> {post.author_name}</span>
            </div>
            
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-black text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-brand-muted text-sm line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="pt-6 mt-auto">
              <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-brand-primary font-black text-[11px] uppercase tracking-widest group/link">
                Read Full Insight 
                <div className="ml-2 w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover/link:bg-brand-primary group-hover/link:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
