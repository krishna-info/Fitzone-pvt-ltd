'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import Script from 'next/script';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const amount = searchParams.get('amount') || '0';
  const reference = searchParams.get('ref') || 'General Payment';
  
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_placeholder',
      amount: parseInt(amount) * 100, // amount in paise
      currency: 'INR',
      name: 'FitZone Apparels',
      description: `Payment for ${reference}`,
      image: '/logo.png',
      handler: function (response: RazorpayResponse) {
        router.push(`/thank-you?type=payment&ref=${response.razorpay_payment_id}`);
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#0A2E5C',
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-brand-lg shadow-float border border-gray-100 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-brand-surface text-brand-primary rounded-full flex items-center justify-center mx-auto">
          <CreditCard className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-brand-dark">Secure Payment</h1>
        <p className="text-brand-muted">Complete your transaction securely via Razorpay.</p>
      </div>

      <div className="bg-brand-surface p-6 rounded-brand border border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-brand-muted">Reference</span>
          <span className="font-bold text-brand-dark">{reference}</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="text-brand-muted">Amount</span>
          <span className="font-extrabold text-brand-primary">₹{amount}</span>
        </div>
      </div>

      <Button 
        variant="primary" 
        size="lg" 
        className="w-full py-6 text-lg"
        onClick={handlePayment}
        disabled={loading || amount === '0'}
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Pay Now'}
      </Button>

      <div className="flex items-center justify-center space-x-2 text-xs text-brand-muted font-medium uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        <span>Secured by Razorpay</span>
      </div>
    </div>
  );
}

export default function PaymentClient() {
  return (
    <div className="py-24 bg-brand-surface min-h-screen flex items-center justify-center px-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-brand-primary" />}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
