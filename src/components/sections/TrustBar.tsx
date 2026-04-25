import { CheckCircle } from 'lucide-react';

const TRUST_ITEMS = [
  { text: '2+ Years Experience' },
  { text: 'Quality Certified' },
  { text: 'Made in Rajasthan' },
];

export function TrustBar() {
  return (
    <div className="bg-brand-primary py-4">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 text-white">
          {TRUST_ITEMS.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-brand-secondary" />
              <span className="text-sm md:text-base font-bold tracking-wide uppercase">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
