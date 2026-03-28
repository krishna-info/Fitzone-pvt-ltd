'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Certificate {
  name: string;
  issuedBy: string;
  issuedDate: string;
  cloudinaryId: string;
  alt: string;
}

export function CertificateCard({ cert }: { cert: Certificate }) {
  // Cloudinary Placeholder
  const imageUrl = `https://res.cloudinary.com/demo/image/upload/v1652345767/docs/certificate_placeholder.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-brand-lg border border-gray-100 shadow-card hover:shadow-card-hover transition-all space-y-4"
    >
      <div className="aspect-[3/4] relative rounded-brand overflow-hidden bg-gray-50 border border-gray-100">
        <Image 
          src={imageUrl}
          alt={cert.alt}
          fill
          className="object-contain p-4"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-brand-dark leading-tight">{cert.name}</h3>
        <p className="text-xs text-brand-muted uppercase font-semibold">{cert.issuedBy}</p>
        <p className="text-xs text-brand-muted">Issued: {cert.issuedDate}</p>
      </div>
      
      <Modal 
        trigger={<Button variant="outline" className="w-full">View Certificate</Button>}
        title={cert.name}
        description={`Issued by ${cert.issuedBy} on ${cert.issuedDate}`}
      >
        <div className="aspect-[3/4] relative w-full bg-gray-50 rounded-brand overflow-hidden">
           <Image 
             src={imageUrl}
             alt={cert.alt}
             fill
             className="object-contain p-4"
           />
        </div>
      </Modal>
    </motion.div>
  );
}
