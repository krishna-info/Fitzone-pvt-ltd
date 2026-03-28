import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | FitZone Apparels',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg mx-auto">
        <div className="space-y-4">
          <p className="text-brand-secondary font-bold uppercase tracking-widest text-sm">Error 404</p>
          <h1 className="text-[120px] font-extrabold text-white leading-none opacity-10 select-none">404</h1>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white -mt-8">Page Not Found</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            The page you are looking for does not exist or has been moved. Let us get you back on track.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
