import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-brand-surface min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-brand-lg shadow-card">
        <h1 className="text-4xl font-black text-brand-dark mb-8">Terms and Conditions</h1>
        <p className="text-brand-muted mb-6">Last Updated: March 28, 2026</p>
        
        <section className="space-y-6 text-brand-dark leading-relaxed">
          <h2 className="text-2xl font-bold mt-8">1. Acceptance of Terms</h2>
          <p>By accessing or using the FitZone Apparels website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>

          <h2 className="text-2xl font-bold mt-8">2. Product Descriptions</h2>
          <p>We strive to ensure that all product descriptions and pricing are accurate. However, we do not warrant that all descriptions are error-free. In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.</p>

          <h2 className="text-2xl font-bold mt-8">3. Orders and Payments</h2>
          <p>All orders are subject to acceptance and availability. Payments are processed securely via Razorpay. We reserve the right to refuse any order for any reason.</p>

          <h2 className="text-2xl font-bold mt-8">4. Shipping and Delivery</h2>
          <p>Delivery times are estimates and not guaranteed. FitZone Apparels is not responsible for delays caused by shipping carriers or customs.</p>
          
          <h2 className="text-2xl font-bold mt-8">5. Returns and Refunds</h2>
          <p>We accept returns for defective items within 7 days of delivery. Please contact our support team on WhatsApp or email for return authorizations.</p>

          <h2 className="text-2xl font-bold mt-8">6. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, and images, is the property of FitZone Apparels and protected by copyright laws.</p>
        </section>
      </div>
    </div>
  );
}
