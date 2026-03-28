export default function ThankYouPage() {
  return (
    <div className="py-24 max-w-screen-xl mx-auto px-4 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full text-green-600">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-brand-dark">Thank You!</h1>
      <p className="text-brand-muted">We have received your enquiry and will get back to you soon.</p>
    </div>
  );
}
