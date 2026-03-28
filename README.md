# FitZone Apparels - Premium B2C E-commerce Platform

FitZone Apparels is a modern, high-performance B2C e-commerce store built for a premium shopping experience. It features a sleek glassmorphism UI, real-time store management, and secure payment integration.

## 🚀 Key Features

### 🛒 Shopping Experience
- **Interactive Product Catalog**: Editorial-style grid with advanced filtering and animations.
- **Dynamic Cart**: Support for multiple sizes per product with real-time subtotal calculations.
- **Secure Checkout**: Integrated with **Razorpay** for seamless UPI, Card, and Net Banking payments.
- **Order Tracking**: Publicly accessible order status page with live delivery progress.
- **Returns System**: built-in 48-hour return request flow with automated UPI collection for COD refunds.

### 🛡️ Admin Dashboard
- **Real-time Stats**: Dashboard with live revenue, order counts, and enquiry tracking.
- **Order Management**: Full control over order statuses and return request approvals.
- **Product CRUD**: Interactive interface to add, edit, or delete products and manage inventory.
- **User Management**: Administrative control over user accounts and permission roles.
- **Enquiry Manager**: Centralized hub for customer contact and bulk order requests.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) + [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Optimized for Vercel

## ⚙️ Environment Variables

Create a `.env.local` file with the following keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Other Integrations
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

## 📜 Database Schema

The project utilizes the following tables in the `public` schema:
- `products`: Catalog items with pricing, features, and images.
- `orders`: Customer orders with status and return tracking.
- `order_items`: Line items linked to orders.
- `profiles`: User metadata and administrative roles.
- `contact_enquiries`: Store contact form submissions.
- `payments`: Detailed Razorpay transaction logs.

## 🏁 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Run development server**: `npm run dev`
4. **Build for production**: `npm run build`

---

Developed with ❤️ for **FitZone Apparels**.
