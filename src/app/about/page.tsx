import { Metadata } from 'next';
import { AboutHero } from '@/components/sections/AboutHero';
import { BrandStory } from '@/components/sections/BrandStory';
import { MissionVision } from '@/components/sections/MissionVision';
import { OwnerIntro } from '@/components/sections/OwnerIntro';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | FitZone Apparels',
  description: 'Learn about our legacy in manufacturing high-performance athletic wear in Rajasthan, India.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BrandStory />
      <MissionVision />
      <OwnerIntro />
      
      {/* Footer-like CTA */}
      <section className="py-20 bg-brand-primary text-white text-center">
        <div className="max-w-screen-xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to explore our manufacturing?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link href="/manufacturing">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">Manufacturing Process</Button>
             </Link>
             <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-dark w-full sm:w-auto">Contact Us</Button>
             </Link>
          </div>
        </div>
      </section>
    </>
  );
}
