import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-surface min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-brand-lg shadow-card">
        <h1 className="text-4xl font-black text-brand-dark mb-8">Privacy Policy</h1>
        <p className="text-brand-muted mb-6">Last Updated: March 28, 2026</p>
        
        <section className="space-y-6 text-brand-dark leading-relaxed">
          <h2 className="text-2xl font-bold mt-8">1. Information We Collect</h2>
          <p>We collect personal information that you provide to us when you make a purchase, such as your name, email address, phone number, and shipping address. Payment information is processed securely through our payment gateway, Razorpay.</p>

          <h2 className="text-2xl font-bold mt-8">2. How We Use Your Information</h2>
          <p>We use your information to process and deliver your orders, communicate with you about your order status, and provide customer support. We may also send you promotional emails if you have opted in to receive them.</p>

          <h2 className="text-2xl font-bold mt-8">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

          <h2 className="text-2xl font-bold mt-8">4. Sharing Your Information</h2>
          <p>We do not sell or rent your personal information to third parties. We share your information with service providers like Razorpay and shipping partners only to complete your transactions.</p>
          
          <h2 className="text-2xl font-bold mt-8">5. Cookies</h2>
          <p>We use cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies in your browser settings.</p>
        </section>
      </div>
    </div>
  );
}
