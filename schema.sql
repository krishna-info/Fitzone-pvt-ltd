-- Fitzone Apparels D1 Database Schema

-- 1. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    enquiry_type TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles (Admin / Users) Table
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Posts (Blog/Articles) Table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    category TEXT,
    author_name TEXT,
    author_role TEXT,
    author_avatar TEXT,
    author_slug TEXT,
    promo_product_slug TEXT,
    promo_category_slug TEXT,
    is_published INTEGER DEFAULT 0,
    published_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    description TEXT NOT NULL,
    price_inr REAL,
    moq INTEGER NOT NULL,
    images TEXT NOT NULL, -- Stored as JSON array string
    colors TEXT, -- Stored as JSON array string (e.g. ["Black", "Navy", "White"])
    sizes TEXT, -- Stored as JSON array string (e.g. ["S", "M", "L", "XL", "XXL"])
    is_enquiry_only INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    features TEXT, -- Stored as JSON array string
    specifications TEXT, -- Stored as JSON object string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_id TEXT,
    razorpay_order_id TEXT,
    return_status TEXT DEFAULT 'none',
    return_reason TEXT,
    refund_method TEXT,
    refund_upi_id TEXT,
    return_requested_at DATETIME,
    refund_processed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase REAL NOT NULL,
    size TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- 7. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT,
    reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes for Cloudflare D1
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active, created_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery_images(created_at);
