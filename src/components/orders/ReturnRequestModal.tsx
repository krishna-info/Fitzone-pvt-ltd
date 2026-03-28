'use client';

import React, { useState } from 'react';
import { requestReturn } from '@/app/admin/orders/actions';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

interface ReturnRequestModalProps {
  orderId: string;
  isCOD: boolean;
}

export function ReturnRequestModal({ orderId, isCOD }: ReturnRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [upiId, setUpiId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestReturn(orderId, reason, isCOD ? upiId : undefined);
      window.location.reload(); // Simple refresh to show new status
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Request Return / Refund"
      description="Please tell us why you want to return this order. We'll process your request within 24 hours."
      trigger={
        <button className="w-full h-16 bg-red-600 text-white rounded-full font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-200">
          Request Return / Refund
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Reason for Return</label>
          <select 
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none bg-white text-sm"
          >
            <option value="">Select a reason...</option>
            <option value="Size issue">Size issue (Item doesn&apos;t fit)</option>
            <option value="Defective product">Defective / Damaged product</option>
            <option value="Wrong item delivered">Wrong item delivered</option>
            <option value="Quality not as expected">Quality not as expected</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {isCOD && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-widest">Refund UPI ID (for COD)</label>
            <input 
              type="text"
              required
              placeholder="e.g. name@okhdfcbank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none text-sm"
            />
            <p className="text-[10px] text-brand-muted flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> This UPI ID will be used for your refund within 36-48h.
            </p>
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700" disabled={loading || !reason}>
            {loading ? 'Submitting...' : 'Submit Return Request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
