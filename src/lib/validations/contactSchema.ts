import { z } from 'zod';

export const contactSchema = z.object({
  name:           z.string().min(2, 'Name must be at least 2 characters'),
  email:          z.string().email('Please enter a valid email address'),
  phone:          z.string().min(10, 'Enter a valid phone number').max(15, 'Phone number too long').optional().or(z.literal('')),
  companyName:    z.string().optional(),
  enquiryType:    z.enum(['retail', 'bulk', 'distributor', 'general']),
  message:        z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
