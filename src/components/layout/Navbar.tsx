'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS, WHATSAPP_NUMBER } from '@/lib/constants';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="FitZone Apparels" width={56} height={56} className="rounded-md" style={{ mixBlendMode: 'multiply' }} priority />
            <span className="text-xl font-extrabold text-brand-primary tracking-tight hidden sm:block">
              FIT<span className="text-brand-secondary">ZONE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-primary ${pathname === link.href ? 'text-brand-primary' : 'text-brand-muted'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="whatsapp" className="hidden lg:flex" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-brand-dark p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Tray */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-4 rounded-brand text-base font-semibold ${pathname === link.href ? 'bg-brand-surface text-brand-primary' : 'text-brand-dark'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Button variant="whatsapp" className="w-full" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
