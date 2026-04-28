import { z } from 'zod';

export const contactSchema = z.object({
  name:           z.string().min(2, 'Name must be at least 2 characters'),
  email:          z.string().email('Please enter a valid email address'),
  phone:          z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  enquiryType:    z.enum(['retail', 'bulk', 'distributor', 'general']),
  message:        z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
