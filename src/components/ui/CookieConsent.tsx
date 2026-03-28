'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check } from 'lucide-react';
import Link from 'next/link';

const CONSENT_KEY = 'fitzone_cookie_consent';

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so it doesn't flash on load
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  if (!mounted) return null;

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    // Fire GA4 consent if available
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
      (window as unknown as { gtag: Function }).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="fixed bottom-6 right-6 z-[80] max-w-sm w-[calc(100vw-3rem)] bg-white rounded-brand-lg shadow-float border border-gray-100 p-5"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Cookie className="w-4 h-4 text-brand-primary" />
            </div>
            <div>
              <p className="font-bold text-brand-dark text-sm">We use cookies</p>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                We use analytics cookies to understand how you use our site and improve your experience.{' '}
                <Link href="/privacy" className="underline hover:text-brand-primary transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
            <button
              onClick={handleDecline}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Decline cookies"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 py-2 px-4 rounded-brand border border-gray-200 text-sm font-medium text-brand-muted hover:border-gray-300 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-2 px-4 rounded-brand bg-brand-primary text-white text-sm font-bold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
