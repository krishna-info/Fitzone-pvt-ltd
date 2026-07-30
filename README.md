# ⚡ FitZone Apparels - Premium B2C & B2B E-Commerce Platform

FitZone Apparels is a modern, high-performance, full-stack e-commerce platform built for high-scale athletic wear retailing and custom apparel manufacturing. Engineered with Next.js 14 App Router, Cloudflare D1 (Edge SQL Database), Cloudflare R2 (Object Storage), and Razorpay payments, the platform delivers a fast shopping experience, client-side image optimization, and a full-featured administrative suite.

---

## 🌟 Architecture & Core Infrastructure

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, React Server Components)
* **Edge Runtime Deployment**: Hosted on Cloudflare Workers using [`@opennextjs/cloudflare`](https://open-next.js.org/cloudflare)
* **Edge SQL Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQLite database distributed at the edge)
* **Asset Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible object bucket for WebP product images & media)
* **Payment Gateway**: [Razorpay](https://razorpay.com/) (UPI, Credit/Debit Cards, NetBanking, Cash on Delivery with auto UPI refund collection)
* **Bot Defense**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) CAPTCHA protection on form submissions
* **Transactional Email**: [Resend](https://resend.com/) API integration for order confirmations and customer enquiries
* **Design & Styling**: Tailwind CSS, Glassmorphism UI components, Framer Motion animations, Lucide React icons

---

## 🚀 Feature Overview

### 🛒 Customer Storefront & Shopping Experience
* **Interactive Product Catalog**: Real-time filtering by category, search indexing, responsive grid views, and smooth page transitions.
* **100% Flexible Product Views**: Supports both **Direct Purchase** products (with dynamic cart subtotal calculation, multi-size selections, and color pickers) and **Enquiry-Only** custom manufacturing products.
* **Dynamic Cart & Drawer**: Persistent cart state managed via Zustand, support for multi-color/multi-size line items, and MOQ validation.
* **Secure Checkout Flow**: Integrated Razorpay payment modal supporting UPI Intent, Cards, NetBanking, and COD options.
* **Public Order Tracking**: Instant tracking portal allowing customers to check order status, delivery progress, and timeline details.
* **48-Hour Automated Return Request System**: Dedicated customer portal for requesting product returns within 48 hours, including automated UPI ID collection for COD refund processing.
* **Manufacturing & Custom Apparel Hub**: Dedicated landing pages and quote submission system for custom sportswear and bulk orders.
* **Gallery & Facility Showcase**: Interactive visual showcase highlighting manufacturing machinery, fabrics, and completed products.
* **Blog & Articles Section**: SEO-optimized editorial content and sports apparel guides.

---

### 🛡️ Administrative Control Panel (`/admin`)

The admin dashboard provides full-stack control over store inventory, order processing, and customer communications:

#### 1. Complete Product Management (CRUD)
All 15 product attributes are 100% editable and customizable:
* **Basic Information**: Product Name, Custom URL Slug, Category, Description.
* **Pricing & Quantity**: Price (in ₹), Minimum Order Quantity (MOQ).
* **Visibility & Purchasing Modes**:
  * **Status**: Toggle between `Active` (visible on storefront) and `Draft` (hidden).
  * **Purchase Mode**: Toggle between `Standard Purchase` (add to cart & checkout) and `Enquiry Only` (request quote).
* **Media & Asset Management**:
  * Public Image URL list manager with live thumbnail previews and link verification.
  * Direct browser file uploader with **automatic Client-Side WebP conversion** before streaming to Cloudflare R2 bucket storage.
* **Interactive Attribute Managers**:
  * **Colors**: Add/remove available color tags (e.g. *Black, Navy Blue, Heather Gray*).
  * **Sizes**: Add/remove available size tags (e.g. *XS, S, M, L, XL, 2XL, 3XL*).
  * **Key Features**: Add/remove bullet points highlighting product benefits (e.g. *100% Moisture-Wicking Mesh*, *4-Way Stretch Fabric*).
  * **Technical Specifications**: Key-Value pair manager to specify custom technical details (e.g. `Fabric: 100% Polyester`, `Fit: Athletic Fit`, `Care: Machine Wash Cold`).

#### 2. Order & Return Management
* Live order dashboard tracking revenue, order counts, payment status, and delivery milestones.
* Order status updater (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
* Return request review portal to approve/reject return requests and verify customer UPI details for refunds.

#### 3. Enquiry & Lead Center
* Centralized dashboard for messages submitted via store contact forms and manufacturing quote requests.

#### 4. Gallery & Media Center
* Upload, tag, categorize, and remove images featured in the public facility gallery.

#### 5. Editorial & Blog Management
* Create, edit, publish, or archive blog posts and articles.

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Cloudflare Credentials & Public R2 CDN URL
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-your-r2-url.r2.dev

# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Resend Email Integration
RESEND_API_KEY=re_your_resend_api_key

# Cloudflare Turnstile CAPTCHA
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# Administrative Credentials (Local Dev Overrides)
ADMIN_EMAIL=admin@fitzoneapparels.com
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_signing_secret
```

`wrangler.toml` handles Cloudflare production environment variables and D1/R2 bindings:

```toml
name = "fitzoneapparels"
main = ".open-next/worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[vars]
ADMIN_EMAIL = "admin@fitzoneapparels.com"
ADMIN_PASSWORD = "your_secure_admin_password"
JWT_SECRET = "your_jwt_signing_secret"

[[d1_databases]]
binding = "DB"
database_name = "fittzone"
database_id = "your-d1-database-id"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "fitzone-bucket"
```

---

## 🗄️ Database Schema (`schema.sql`)

The Cloudflare D1 SQL database comprises 8 primary tables:

```sql
-- 1. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_name TEXT,
    estimated_quantity TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles / Admin Accounts Table
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Articles & Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT,
    author TEXT,
    published INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table (100% Fully Configurable)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    description TEXT NOT NULL,
    price_inr REAL,
    moq INTEGER NOT NULL,
    images TEXT NOT NULL,         -- JSON array of image URLs
    colors TEXT,                 -- JSON array of available colors
    sizes TEXT,                  -- JSON array of available sizes
    is_enquiry_only INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    features TEXT,               -- JSON array of bullet features
    specifications TEXT,         -- JSON object of key-value specifications
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    return_requested INTEGER DEFAULT 0,
    return_reason TEXT,
    return_status TEXT,
    upi_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Line Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_inr REAL NOT NULL,
    selected_color TEXT,
    selected_size TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 7. Payment Transaction Logs Table
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    razorpay_payment_id TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_signature TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 8. Gallery Showcase Table
CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📁 Project Structure

```
fitzone-web/
├── public/                     # Static public assets, favicons, logos
├── schema.sql                  # Primary Cloudflare D1 SQL schema
├── wrangler.toml               # Cloudflare Workers & D1/R2 configuration
├── open-next.config.ts         # OpenNext build engine configuration
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS styling design tokens
├── package.json                # Project dependencies and CLI scripts
├── src/
│   ├── app/                    # Next.js 14 App Router routes & Server Actions
│   │   ├── admin/              # Admin dashboard, login, actions, product/order management
│   │   ├── api/                # API routes (Razorpay webhooks, product queries, contact)
│   │   ├── products/           # Catalog view, category routes, product details page
│   │   ├── checkout/           # Shopping cart checkout page
│   │   ├── orders/             # Order tracking & returns portal
│   │   ├── manufacturing/      # Custom B2B manufacturing hub
│   │   ├── gallery/            # Interactive facility showcase
│   │   ├── article/            # Blog article detail views
│   │   ├── layout.tsx          # Root layout with Nav, Footer, Cart Drawer
│   │   └── page.tsx            # Storefront homepage with hero section
│   ├── components/             # Reusable UI components
│   │   ├── admin/              # Admin modals, product form, order table, gallery editor
│   │   ├── pages/              # Client interactive page components
│   │   ├── sections/           # Homepage hero, product grid, feature highlights
│   │   └── ui/                 # Buttons, Modals, Cards, Drawer, Form controls
│   ├── lib/                    # Helper utilities, DB getters, image converter, product types
│   └── store/                  # Zustand global cart state store
```

---

## 🛠️ Local Development & Operations Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/fitzone/fitzone-web.git
cd fitzone-web
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. TypeScript Type Audit
Run a non-emitting project-wide type check:
```bash
npx tsc --noEmit
```

### 4. Lint & Code Quality Audit
```bash
npm run lint
```

### 5. Build for Production Testing
Generate the static and server bundle via OpenNext Cloudflare builder:
```bash
npm run build
```

### 6. Deploy to Cloudflare Workers
Deploy the built worker application to Cloudflare Workers:
```bash
npm run deploy
```

---

## 📄 License

Copyright © 2026 **FitZone Apparels**. All rights reserved.
