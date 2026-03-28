# FitZone Apparels — Phase 2 Next Steps Prompt

> **Context:** Phase 1 MVP is complete. 16/16 routes are production-built and verified. This prompt is the authoritative handoff document for Phase 2 execution.

---

## Phase 1 Completion Summary

The following has been delivered and verified in Phase 1:

- Next.js 14 (App Router) project with TypeScript, Tailwind CSS, Radix UI, and Framer Motion
- 16 pre-rendered routes including `/`, `/about`, `/manufacturing`, `/certifications`, `/gallery`, `/products`, `/contact`, `/payment`, `/thank-you`, and legal/error pages
- Contact form with Zod validation, Cloudflare Turnstile CAPTCHA, and mocked Supabase + Resend integration
- Razorpay payment integration on `/payment` with dynamic amount and reference params
- Keystatic JSON-powered Certifications page and Cloudinary-powered Gallery
- OpenStreetMap (Leaflet) on the Manufacturing page
- Full SEO metadata on all major routes
- WCAG-compliant semantic HTML, heading hierarchy, and accessibility attributes

---

## Phase 2 Objectives

Phase 2 transitions the site from a marketing shell to a **fully operational business platform** with live content, real integrations, analytics, and a product catalogue.

---

## Task 1 — Activate Live Backend Integrations

### 1.1 Supabase (Production)

Replace all mocked Supabase calls with live production credentials.

- Create a `contact_enquiries` table in Supabase with the following schema:

```sql
create table contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  enquiry_type text,
  message text not null,
  submitted_at timestamptz default now(),
  status text default 'new'
);
```

- Set up Row Level Security (RLS) so only authenticated admin users can read rows
- Update `/api/contact/route.ts` to insert real records into this table
- Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.production`

### 1.2 Resend (Production Email)

- Create a verified sender domain in Resend (e.g. `no-reply@fitzone.in`)
- Update `/api/contact/route.ts` to send a confirmation email to the visitor and a notification email to `amrit@fitzone.in` (or the owner's configured email)
- Use the following email template structure:

```
Subject: "We received your enquiry — FitZone Apparels"
Body: Thank the user, restate their enquiry type, provide WhatsApp link for faster response
```

- Set `RESEND_API_KEY` in `.env.production`

### 1.3 Razorpay (Production Keys)

- Replace test API keys with live Razorpay credentials in `.env.production`
- Add webhook endpoint at `/api/razorpay/webhook` to handle `payment.captured` and `payment.failed` events
- Log all payment events to a `payments` table in Supabase:

```sql
create table payments (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text,
  razorpay_payment_id text,
  amount integer,
  currency text default 'INR',
  status text,
  reference text,
  created_at timestamptz default now()
);
```

---

## Task 2 — CMS Content Population

### 2.1 Certifications Content

- Add real certificate images to `src/content/certifications/`
- Each certificate entry in the Keystatic JSON file should follow this schema:

```json
{
  "id": "cert-001",
  "title": "Certificate Name",
  "issuer": "Issuing Authority",
  "issued_date": "2024-01",
  "image": "/certifications/cert-001.jpg",
  "pdf_url": "/certifications/cert-001.pdf"
}
```

- Ensure the Certifications page lightbox supports both image and PDF viewing
- Add a download button for each certificate in the lightbox modal

### 2.2 Gallery Content

- Replace placeholder Cloudinary images with actual manufacturing facility photos
- Organise uploads into Cloudinary folders: `fitzone/manufacturing`, `fitzone/products`, `fitzone/facility`
- Update gallery filter tags to match the new categories: `All`, `Manufacturing`, `Products`, `Facility`

### 2.3 About Us & Manufacturing Page Copy

- Replace all placeholder copy with client-approved content:
  - Brand story and 2-year experience narrative
  - Owner bio (Amrit Singh Inda)
  - Manufacturing process steps with real facility data
  - QA checklist items from actual production standards
- Confirm final **brand tagline** with client and update the Hero section
- Confirm **colour palette** — if client has changed from current dark theme, apply new tokens in `tailwind.config.ts`

---

## Task 3 — Product Catalogue (Phase 2 Core Feature)

### 3.1 Product Data Schema

Create a `products` table in Supabase:

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  description text,
  price_inr integer,
  moq integer,                    -- Minimum order quantity for B2B
  images text[],                  -- Array of Cloudinary URLs
  is_enquiry_only boolean default true,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

### 3.2 Product Categories (as per PRD)

Seed the following initial categories (confirm with client):

- T-Shirts & Jerseys
- Shorts & Track Pants
- Jackets & Hoodies
- Compression Wear
- Accessories

### 3.3 Product Pages

Build the following routes:

| Route | Purpose |
|---|---|
| `/products` | Category grid (already shell-built in Phase 1) — populate with live Supabase data |
| `/products/[category]` | Filtered product listing page per category |
| `/products/[category]/[slug]` | Individual product detail page with image carousel, description, enquiry CTA |

Each product detail page must include:
- Image carousel (use `embla-carousel-react`)
- Product name, description, MOQ
- Conditional pricing: show price if `is_enquiry_only = false`, else show "Price on Enquiry" with WhatsApp CTA
- "Enquire via WhatsApp" button pre-filled with product name and slug
- "Add to Enquiry Cart" button (see Task 4)

### 3.4 Pricing Policy

Confirm with client (per PRD FR-10):
- **Option A:** Display price publicly → set `is_enquiry_only = false` for all products
- **Option B:** Price on enquiry → keep `is_enquiry_only = true` (default)

---

## Task 4 — Enquiry Cart (B2B Flow)

Build a lightweight "Enquiry Cart" flow for bulk buyers — not a checkout, but a structured multi-product enquiry.

### 4.1 Cart State

Use Zustand for client-side cart state:

```bash
npm install zustand
```

Store: `{ items: [{ productId, name, quantity }], addItem, removeItem, clearCart }`

### 4.2 Cart UI

- Floating cart icon (bottom-left, opposite to WhatsApp button)
- Slide-in cart drawer showing selected products and quantities
- "Send Enquiry" button at the bottom of the drawer

### 4.3 Cart Submission

On "Send Enquiry":
1. Format the cart contents into a structured WhatsApp message
2. Open `https://wa.me/917742231208?text=...` with the pre-filled message
3. Also submit cart data to `/api/enquiry` → insert into `contact_enquiries` with `enquiry_type = 'bulk_order'`

---

## Task 5 — Analytics & SEO

### 5.1 Google Analytics 4

- Create a GA4 property for `fitzone.in`
- Install `@next/third-parties` for GA4 (Next.js 14 recommended approach):

```bash
npm install @next/third-parties
```

- Add `<GoogleAnalytics gaId="G-XXXXXXXXXX" />` to `app/layout.tsx`
- Set up the following conversion events in GA4:
  - `form_submit` — Contact form submission
  - `whatsapp_click` — WhatsApp button click
  - `payment_success` — Razorpay payment captured
  - `enquiry_cart_submit` — Enquiry cart submission

### 5.2 Google Search Console

- Verify domain ownership via DNS TXT record
- Submit `sitemap.xml` (already generated in Phase 1)
- Monitor Core Web Vitals and coverage reports post-launch

### 5.3 Cookie Consent Banner (FR-15)

Implement a GDPR-compliant consent banner:

```bash
npm install @consent-manager/core
```

- Show on first visit; store preference in `localStorage`
- Block GA4 script loading until `analytics` consent is granted
- Link to `/privacy-policy` page

---

## Task 6 — Admin Dashboard (FR-13)

Build a protected admin area for the client to manage enquiries.

### 6.1 Authentication

Use Supabase Auth with email/password:

```bash
npm install @supabase/auth-helpers-nextjs
```

- Create `/admin/login` route with email + password form
- Protect all `/admin/*` routes with Supabase session middleware in `middleware.ts`
- Only allow the owner email (`amrit@fitzone.in`) to log in — enforce via Supabase Auth invite

### 6.2 Dashboard Pages

| Route | Feature |
|---|---|
| `/admin` | Summary stats: total enquiries, new enquiries, payments received |
| `/admin/enquiries` | Table of all contact form submissions with status filter (new / contacted / closed) |
| `/admin/payments` | Table of all Razorpay payment records |
| `/admin/products` | CRUD interface for managing products (name, category, images, price, active status) |

### 6.3 Enquiry Management

- Allow admin to change status of each enquiry (new → contacted → closed)
- Add a "Reply via Email" button that opens the default mail client with pre-filled recipient
- Add CSV export for enquiries

---

## Task 7 — Remaining PRD Features

### 7.1 Legal Pages

Build the following pages with client-approved content:

- `/privacy-policy` — Data handling, cookie usage, GDPR rights
- `/terms-and-conditions` — Website terms of use, payment policy, refund policy

### 7.2 404 and Error Pages (FR-16)

- Verify `/app/not-found.tsx` is in place with branded design and "Back to Home" CTA
- Add `/app/error.tsx` for runtime errors with the same branded treatment

### 7.3 Social Media Links (FR-17)

- Confirm with client: Instagram, Facebook, LinkedIn URLs
- Update the Footer component's social link array in `components/layout/Footer.tsx`
- Replace placeholder `#` hrefs with real URLs

### 7.4 Google Maps Embed (FR-18)

- Replace the current OpenStreetMap (Leaflet) with a Google Maps embed on `/manufacturing` and `/contact`
- Use the Maps Embed API (free tier, no JS API key required for basic iframe embed)
- Pin the Haryana manufacturing location precisely — confirm exact address with client

---

## Task 8 — Pre-Launch QA & Performance

### 8.1 Performance Targets (per PRD NFR)

Run the following checks before go-live:

| Check | Tool | Target |
|---|---|---|
| Page Speed | Google PageSpeed Insights | > 90 mobile score |
| LCP | Chrome DevTools | < 2.5s |
| CLS | Chrome DevTools | < 0.1 |
| FID / INP | Chrome DevTools | < 100ms |
| Bundle Size | `next build` output | No route > 200 kB first load JS |

### 8.2 Cross-Browser Testing

Test all 16 routes on:
- Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)
- Android 9+ (mid-range device simulation)
- iOS 13+ (Safari)

### 8.3 Security Checklist

- [ ] HTTPS enforced via Vercel (automatic)
- [ ] All `.env` secrets excluded from Git (verify `.gitignore`)
- [ ] Supabase RLS enabled on all tables
- [ ] Razorpay webhook signature verified in `/api/razorpay/webhook`
- [ ] Admin panel protected by Supabase Auth middleware
- [ ] Contact form rate-limited (Cloudflare Turnstile already in place)
- [ ] No sensitive data logged to console in production

---

## Task 9 — Deployment & Go-Live

### 9.1 Domain & DNS

- Point `fitzone.in` A record to Vercel deployment
- Configure `www.fitzone.in` as a redirect to `fitzone.in` (non-www canonical)
- SSL is automatic via Vercel — verify green lock post-DNS propagation

### 9.2 Environment Variables (Production)

Set the following in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### 9.3 Post-Deployment Verification Checklist

- [ ] All 16 routes return 200 (run `curl` or use Vercel deployment summary)
- [ ] Contact form submits successfully and email is received
- [ ] Razorpay test payment flow completes end-to-end
- [ ] GA4 real-time view shows a live session
- [ ] WhatsApp button opens correct number on mobile
- [ ] Admin login works and dashboard loads

---

## Client Action Items (Blocking Phase 2 Start)

The following must be received from the client before full Phase 2 execution:

| Item | Priority | Owner |
|---|---|---|
| Final brand tagline | High | Amrit Singh Inda |
| Confirmed colour palette | High | Amrit Singh Inda |
| Real certificate images/PDFs | High | Amrit Singh Inda |
| Manufacturing facility photos | High | Amrit Singh Inda |
| Product list with names, categories, images, and MOQ | High | Amrit Singh Inda |
| Pricing policy decision (public vs enquiry-only) | High | Amrit Singh Inda |
| Social media URLs (Instagram, Facebook, LinkedIn) | Medium | Amrit Singh Inda |
| About Us and Manufacturing page copy (approved) | Medium | Amrit Singh Inda |
| Confirmed Haryana facility address for map pin | Medium | Amrit Singh Inda |
| Razorpay live account credentials | High | Amrit Singh Inda |
| Domain registrar access for DNS cutover | High | Amrit Singh Inda |

---

## Phase 2 Estimated Timeline

| Task | Estimated Duration |
|---|---|
| Task 1 — Live backend integrations | 3 days |
| Task 2 — CMS content population | 2 days (blocked on client assets) |
| Task 3 — Product catalogue | 5 days |
| Task 4 — Enquiry cart | 2 days |
| Task 5 — Analytics & SEO | 1 day |
| Task 6 — Admin dashboard | 4 days |
| Task 7 — Remaining PRD features | 2 days |
| Task 8 — QA & performance | 3 days |
| Task 9 — Deployment & go-live | 1 day |
| **Total** | **~3–4 weeks** |

> Timeline assumes client assets are delivered within the first week. Delays in client deliverables will push go-live proportionally.

---

*Document generated from: `FitZone_PRD_v1_0.md`, `walkthrough.md`, `task.md`*
*Phase 1 completion confirmed. Phase 2 ready to commence upon client asset delivery.*
