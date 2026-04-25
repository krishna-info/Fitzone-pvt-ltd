import { Metadata } from 'next';
import { ContactForm } from '@/components/ui/ContactForm';
import { Mail, Phone, MapPin, FileText } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE, BUSINESS_ADDRESS, GSTIN, LEGAL_NAME } from '@/lib/constants';
import { LocationMap } from '@/components/sections/LocationMap';

export const metadata: Metadata = {
  title: 'Contact Us | FitZone Apparels',
  description: `Get in touch with ${LEGAL_NAME} for bulk orders, wholesale enquiries, or custom manufacturing requests.`,
};

export default function ContactPage() {
  return (
    <div className="py-24 bg-brand-surface">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Get in Touch</h1>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Have a bulk requirement or a custom design in mind? Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-8 bg-white rounded-brand-lg shadow-card border border-gray-100 space-y-6">
               <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center flex-shrink-0">
                     <Phone className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                     <h3 className="font-bold text-brand-dark">Call Us</h3>
                     <p className="text-brand-muted">{CONTACT_PHONE}</p>
                  </div>
               </div>
               
               <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center flex-shrink-0">
                     <Mail className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                     <h3 className="font-bold text-brand-dark">Email Us</h3>
                     <p className="text-brand-muted">{CONTACT_EMAIL}</p>
                  </div>
               </div>

               <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center flex-shrink-0">
                     <MapPin className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                     <h3 className="font-bold text-brand-dark">Our Location</h3>
                     <p className="text-brand-muted">{BUSINESS_ADDRESS}</p>
                  </div>
               </div>

               <div className="flex items-start space-x-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center flex-shrink-0">
                     <FileText className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                     <h3 className="font-bold text-brand-dark">GST Details</h3>
                     <p className="text-xs text-brand-muted font-mono">{GSTIN}</p>
                     <p className="text-[10px] text-brand-muted uppercase mt-1">{LEGAL_NAME}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Location Map */}
        <div className="mt-24">
           <LocationMap />
        </div>
      </div>
    </div>
  );
}
