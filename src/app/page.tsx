import Link from 'next/link';
import { HeroSection } from '@/components/sections/HeroSection';
import { TrustBar } from '@/components/sections/TrustBar';
import { AboutSnapshot } from '@/components/sections/AboutSnapshot';
import { ManufacturingProcess } from '@/components/sections/ManufacturingProcess';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <AboutSnapshot />
      <ManufacturingProcess />
      
      {/* Gallery Preview Placeholder */}
      <section className="py-24 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Our Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-gray-100 rounded-brand overflow-hidden shadow-card" />
             ))}
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-20 bg-brand-dark text-white text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">Ready to start your <br /> next project together?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="px-8 py-4 bg-brand-secondary rounded-brand font-bold hover:bg-brand-secondary/90 transition-all">
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
