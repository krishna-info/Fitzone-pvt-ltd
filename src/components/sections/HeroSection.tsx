'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100vh-80px)] min-h-[600px] flex items-center overflow-hidden bg-brand-dark">
      {/* Background Graphic / Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
      </div>

      <div className="relative z-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Premium <br />
              <span className="text-brand-secondary">Athletic Wear</span> <br />
              Manufacturing.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed"
          >
            <span className="italic text-brand-secondary font-semibold">&ldquo;Comfort That Moves With You.&rdquo;</span>
            <br />
            <span className="mt-2 block">FitZone Apparels Pvt. Ltd. delivers world-class quality in sportswear — from track pants to high-performance jerseys, manufactured for champions.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              size="lg" 
              variant="whatsapp" 
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
              className="text-base"
            >
              <MessageCircle className="w-5 h-4 mr-2" />
              WhatsApp Us
            </Button>
            <Link href="/products">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-brand-dark text-base w-full sm:w-auto"
              >
                Shop Now
                <ArrowRight className="w-5 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
