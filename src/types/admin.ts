export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  city: string;
  pincode: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_id: string | null;
  razorpay_order_id: string | null;
  created_at: string;
  return_status: 'none' | 'requested' | 'approved' | 'rejected' | 'refunded';
  return_reason: string | null;
  refund_method: string | null;
  refund_upi_id: string | null;
  return_requested_at: string | null;
  refund_processed_at: string | null;
  order_items?: OrderItem[];
}
