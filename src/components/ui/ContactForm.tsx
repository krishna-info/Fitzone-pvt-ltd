'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations/contactSchema';
import { Button } from '@/components/ui/Button';


export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      enquiryType: 'general',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        reset();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('An error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 bg-green-50 border border-green-200 rounded-brand-lg text-center space-y-4">
        <h3 className="text-xl font-bold text-green-800">Enquiry Sent Successfully!</h3>
        <p className="text-green-700">Thank you for reaching out. We will contact you within 24 hours.</p>
        <Button variant="outline" onClick={() => setSuccess(false)}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-brand-lg shadow-card border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-brand-dark">Full Name</label>
          <input
            id="name"
            {...register('name')}
            className={`w-full px-4 py-3 rounded-brand border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-brand-primary outline-none transition-all`}
            placeholder="Amrit Singh"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-brand-dark">Email Address</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-4 py-3 rounded-brand border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-brand-primary outline-none transition-all`}
            placeholder="amrit@fitzone.in"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-semibold text-brand-dark">Phone Number</label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={`w-full px-4 py-3 rounded-brand border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-brand-primary outline-none transition-all`}
            placeholder="9876543210"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="enquiryType" className="text-sm font-semibold text-brand-dark">Enquiry Type</label>
          <select
            id="enquiryType"
            {...register('enquiryType')}
            className="w-full px-4 py-3 rounded-brand border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none transition-all bg-white"
          >
            <option value="general">General Enquiry</option>
            <option value="bulk">Bulk Order</option>
            <option value="retail">Retail Enquiry</option>
            <option value="distributor">Distributor Enquiry</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-brand-dark">Your Message</label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className={`w-full px-4 py-3 rounded-brand border ${errors.message ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none`}
          placeholder="Tell us about your requirements..."
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
        {isSubmitting ? 'Sending...' : 'Send Enquiry'}
      </Button>
    </form>
  );
}
