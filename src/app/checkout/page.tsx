import { Metadata } from 'next';
import { CheckoutClient } from '@/components/pages/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | FitZone Apparels',
  description: 'Complete your purchase securely.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
