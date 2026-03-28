'use client';

import Image from 'next/image';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CONTACT_PHONE, WHATSAPP_NUMBER } from '@/lib/constants';

export function OwnerIntro() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/3 aspect-[3/4] relative rounded-brand-lg overflow-hidden shadow-float">
             <Image 
               src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" 
               alt="Amrit Singh Inda - Owner of FitZone"
               fill
               className="object-cover"
             />
          </div>
          <div className="flex-1 space-y-8">
            <div className="space-y-4 text-center md:text-left">
              <span className="text-brand-primary font-bold uppercase tracking-widest text-sm">Leadership</span>
              <h2 className="text-4xl font-extrabold text-brand-dark">Meet Our Founder</h2>
              <h3 className="text-2xl font-bold text-brand-secondary">Amrit Singh Inda</h3>
            </div>
            
            <p className="text-lg text-brand-muted italic leading-relaxed text-center md:text-left">
              &quot;At FitZone, we don&apos;t just make clothes; we manufacture confidence. Every product that leaves our facility is a testament to our commitment to India&apos;s growing athletic culture.&quot;
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button 
                variant="whatsapp"
                onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Amrit
              </Button>
              <Button 
                variant="call"
                onClick={() => window.location.href = `tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Directly
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
