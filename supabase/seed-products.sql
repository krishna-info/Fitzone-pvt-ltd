-- ============================================================
-- FitZone Apparels — B2C Retail Products (Updated)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Ensure table has B2C columns
alter table products add column if not exists features text[] default '{}';
alter table products add column if not exists specifications jsonb default '{}';
alter table products add column if not exists price_inr integer;

-- 2. Clear existing products (optional, use with caution)
-- truncate products cascade;

-- 3. Insert/Update retail-focused products
insert into products (slug, name, category, category_slug, description, price_inr, moq, images, is_enquiry_only, features, specifications)
values
  (
    'ultra-breathable-training-tee',
    'Ultra-Breathable Training Tee',
    'T-Shirts & Jerseys',
    't-shirts-jerseys',
    'Elevate your workout with our flagship training tee. Crafted from high-density moisture-wicking fabric, this shirt keeps you dry and focused through every rep. Designed with an athletic fit that contours perfectly to your body without restricting movement.',
    899,
    1,
    array['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887'],
    false,
    array['Pro-grade moisture management', 'Anti-odor silver ion technology', 'Reflective branding for night visibility', '4-way stretch knit construction'],
    '{"Material": "92% Polyester, 8% Elastane", "Fit": "Athletic / Slim", "Weight": "160 GSM", "Care": "Machine wash cold"}'
  ),
  (
    'pro-player-mesh-jersey',
    'Pro-Player Mesh Jersey',
    'T-Shirts & Jerseys',
    't-shirts-jerseys',
    'Designed for the field, built for the gym. Our Pro-Player Jersey uses a dual-layered mesh weave to provide maximum airflow while maintaining a sleek, professional look. Perfect for team sports or solo training.',
    999,
    1,
    array['https://images.unsplash.com/photo-1622519407650-3df9883f76a5?q=80&w=1965'],
    false,
    array['Maximum ventilation mesh panels', 'Flat-lock seams to prevent chafing', 'Vibrant sublimation-ready fabric', 'Quick-dry performance'],
    '{"Material": "100% Breathable Polyester", "Fit": "Standard / Loose", "Weight": "140 GSM", "Care": "Hand wash recommended"}'
  ),
  (
    'tapered-performance-track-pants',
    'Tapered Performance Track Pants',
    'Shorts & Track Pants',
    'shorts-track-pants',
    'The ultimate versatile bottom. Whether you''re warming up on the track or lounging on your recovery day, these tapered pants offer the perfect blend of style and function. Features secure zip pockets and an adjustable drawcord waist.',
    1499,
    1,
    array['https://images.unsplash.com/photo-1552664199-fd31f7431a55?q=80&w=1887'],
    false,
    array['Encapsulated elastic waistband', 'YKK hidden zip side pockets', 'Ankle-zip design for easy on/off', 'Water-resistant finish'],
    '{"Material": "85% Nylon, 15% Spandex", "Fit": "Tapered / JoggerStyle", "Pockets": "2 Side Zip, 1 Back", "Care": "Do not bleach"}'
  ),
  (
    'elite-7-inch-training-shorts',
    'Elite 7" Training Shorts',
    'Shorts & Track Pants',
    'shorts-track-pants',
    'Minimalist design, maximum performance. These 7-inch shorts are built for heavy lifting and explosive movements. No liner design allows for your choice of base layer.',
    749,
    1,
    array['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2070'],
    false,
    array['Split-hem for unrestricted range of motion', 'Lightweight ripstop fabric', 'Internal key pocket', 'Sweat-proof back pocket'],
    '{"Material": "Stretch Ripstop Polyester", "Inseam": "7 Inches", "Liner": "No Liner", "Care": "Tumble dry low"}'
  ),
  (
    'apex-windbreaker-jacket',
    'Apex Windbreaker Jacket',
    'Jackets & Hoodies',
    'jackets-hoodies',
    'Defy the elements. The Apex Windbreaker is your go-to layer for outdoor training in unpredictable weather. Lightweight, packable, and seriously stylish.',
    2499,
    1,
    array['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935'],
    false,
    array['DWR (Durable Water Repellent) coating', 'Stowable adjustable hood', 'Elasticated cuffs for wind protection', 'Inner tech pocket with media port'],
    '{"Material": "Recycled Polyester Shell", "Weight": "Lightweight", "Weather": "Wind & Rain Resistant", "Care": "Cool iron if needed"}'
  )
on conflict (slug) do update set
  description = excluded.description,
  price_inr = excluded.price_inr,
  moq = excluded.moq,
  images = excluded.images,
  is_enquiry_only = excluded.is_enquiry_only,
  features = excluded.features,
  specifications = excluded.specifications;
