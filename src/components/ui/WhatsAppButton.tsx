'use client';

import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export function WhatsAppButton() {
  const text = encodeURIComponent("Hi FitZone, I'd like to enquire about your products.");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with FitZone on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full
                 flex items-center justify-center shadow-float
                 hover:bg-[#128C7E] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary"
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </a>
  );
}
