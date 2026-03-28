'use client';

import React, { useState } from 'react';
import { updateReturnStatus, updateOrderStatus } from '@/app/admin/orders/actions';

interface OrderActionButtonsProps {
  orderId: string;
  returnStatus: string;
}

export function OrderActionButtons({ orderId, returnStatus }: OrderActionButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (newStatus: string, type: 'order' | 'return') => {
    setLoading(true);
    try {
      if (type === 'return') {
        await updateReturnStatus(orderId, newStatus);
      } else {
        await updateOrderStatus(orderId, newStatus);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (returnStatus === 'requested') {
    return (
      <div className="flex lg:flex-col gap-3 w-full">
        <button 
          onClick={() => handleAction('approved', 'return')}
          disabled={loading}
          className="flex-1 px-5 py-3 rounded-xl bg-green-600 text-white text-sm font-black hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
        >
          Approve Return
        </button>
        <button 
          onClick={() => handleAction('rejected', 'return')}
          disabled={loading}
          className="flex-1 px-5 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-black hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    );
  }

  if (returnStatus === 'approved') {
    return (
      <button 
        onClick={() => handleAction('refunded', 'return')}
        disabled={loading}
        className="w-full px-5 py-3 rounded-xl bg-brand-primary text-brand-dark text-sm font-black hover:scale-[1.02] transition-all shadow-md shadow-brand-primary/20 disabled:opacity-50"
      >
        Mark as Refunded
      </button>
    );
  }

  return (
    <div className="flex lg:flex-col gap-3 w-full">
      <button 
        onClick={() => handleAction('delivered', 'order')}
        disabled={loading}
        className="flex-1 px-5 py-3 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-brand-primary transition-colors shadow-sm disabled:opacity-50"
      >
        Mark Delivered
      </button>
      <button className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-brand-dark text-sm font-black hover:bg-gray-50 transition-colors disabled:opacity-50">
        View Details
      </button>
    </div>
  );
}
