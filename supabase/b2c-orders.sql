-- 0. Update products table for B2C metadata
alter table products add column if not exists features text[] default '{}';
alter table products add column if not exists specifications jsonb default '{}';

-- 1. Create orders table
create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  shipping_address text not null,
  city            text not null,
  pincode         text not null,
  subtotal        integer not null,
  shipping        integer default 0,
  total           integer not null,
  status          text default 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_id      text, -- Razorpay Payment ID
  razorpay_order_id text,
  created_at      timestamptz default now()
);

-- 2. Create order_items table
create table if not exists order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid references orders(id) on delete cascade,
  product_id      uuid references products(id),
  product_name    text not null,
  quantity        integer not null,
  price_at_purchase integer not null,
  created_at      timestamptz default now()
);

-- 3. Create payments table (for logging all transactions/attempts)
create table if not exists payments (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid references orders(id),
  razorpay_order_id text not null,
  razorpay_payment_id text,
  razorpay_signature text,
  amount          integer not null,
  status          text not null,
  raw_response    jsonb,
  created_at      timestamptz default now()
);

-- 4. RLS for Orders (Public can create, Admin can read)
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;

create policy "Admin can read orders" ON orders for select using (true); -- simplify for now, check admin session in middleware/api
create policy "Public can insert orders" ON orders for insert with check (true);

create policy "Admin can read order items" ON order_items for select using (true);
create policy "Public can insert order items" ON order_items for insert with check (true);

-- 5. Update existing products to have prices for B2C testing
update products set price_inr = 799, is_enquiry_only = false where slug = 'dri-fit-training-tshirt';
update products set price_inr = 999, is_enquiry_only = false where slug = 'mesh-sports-jersey';
update products set price_inr = 1299, is_enquiry_only = false where slug = 'athletic-track-pants';
update products set price_inr = 849, is_enquiry_only = false where slug = 'pro-training-shorts';
update products set price_inr = 1499, is_enquiry_only = false where slug = 'windbreaker-jacket';
update products set price_inr = 1199, is_enquiry_only = false where slug = 'fleece-training-hoodie';
update products set price_inr = 1599, is_enquiry_only = false where slug = 'compression-base-layer';
update products set price_inr = 499, is_enquiry_only = false where slug = 'sports-headband-set';
