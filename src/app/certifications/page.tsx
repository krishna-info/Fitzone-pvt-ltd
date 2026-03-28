import { Metadata } from 'next';
import { CertificateCard } from '@/components/sections/CertificateCard';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Our Certifications | FitZone Apparels',
  description: 'View our official certifications and quality excellence awards, ensuring industry-standard manufacturing.',
};

export default function CertificationsPage() {
  const certsDir = path.join(process.cwd(), 'src/content/certifications');
  const filenames = fs.readdirSync(certsDir);
  const certs = filenames.map(name => {
    const filePath = path.join(certsDir, name);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  });

  return (
    <div className="bg-brand-surface min-h-screen">
      <section className="bg-brand-dark py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-4">
           <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight">Our Certifications</h1>
           <p className="mt-4 text-gray-400 text-lg">Proof of our commitment to quality, ethics, and excellence.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certs.map((cert, index) => (
              <CertificateCard key={index} cert={cert} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-gray-100">
         <div className="max-w-screen-xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark text-balance">
               Compliance is at the heart of our operations.
            </h2>
            <p className="text-brand-muted max-w-2xl mx-auto">
               From legal registrations to industry awards, we maintain a transparent and certified manufacturing process. If you require specific compliance documentation for your orders, please contact us.
            </p>
         </div>
      </section>
    </div>
  );
}
