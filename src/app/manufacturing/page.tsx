import { Metadata } from 'next';
import { ManufacturingHero } from '@/components/sections/ManufacturingHero';
import { FacilityOverview } from '@/components/sections/FacilityOverview';
import { ManufacturingProcess } from '@/components/sections/ManufacturingProcess';
import { QualityAssurance } from '@/components/sections/QualityAssurance';
import { LocationMap } from '@/components/sections/LocationMap';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manufacturing Excellence | FitZone Apparels',
  description: 'Explore our state-of-the-art manufacturing facility and precision production process in Haryana.',
};

export default function ManufacturingPage() {
  return (
    <>
      <ManufacturingHero />
      <FacilityOverview />
      <ManufacturingProcess />
      <QualityAssurance />
      <LocationMap />
      
      <section className="py-20 bg-brand-secondary text-white text-center">
        <div className="max-w-screen-xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">Bulk Order Enquiries?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link href="/contact?type=bulk">
                <Button variant="primary" size="lg" className="w-full sm:w-auto bg-brand-dark hover:bg-black">Request a Bulk Quote</Button>
             </Link>
             <Link href="/products">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-dark w-full sm:w-auto">View Product Categories</Button>
             </Link>
          </div>
        </div>
      </section>
    </>
  );
}
