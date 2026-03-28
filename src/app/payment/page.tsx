import { Metadata } from 'next';
import PaymentClient from '@/components/pages/PaymentClient';

export const metadata: Metadata = {
  title: 'Secure Payment | FitZone Apparels',
  description: 'Complete your transaction securely via Razorpay.',
};

export default function PaymentPage() {
  return <PaymentClient />;
}
