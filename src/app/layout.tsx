import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FitZone Apparels - Quality Manufacturing',
  description: 'FitZone Apparels Pvt. Ltd., Rajasthan, India. Manufacturers of high-quality athletic wear, track pants, and more.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  }
};

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ShoppingCart } from '@/components/ui/ShoppingCart';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { GoogleAnalytics } from '@next/third-parties/google';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import WebsiteSchema from '@/components/seo/WebsiteSchema';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased font-sans bg-brand-surface text-brand-dark min-h-screen flex flex-col">
        <LocalBusinessSchema />
        <WebsiteSchema />
        <Navbar />

        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <ShoppingCart />
        <CookieConsent />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
