-- Migration: 0001_add_variant_and_updated_at_columns.sql
-- Description: Add missing variant and timestamp columns for existing Cloudflare D1 databases.

ALTER TABLE products ADD COLUMN colors TEXT;
ALTER TABLE products ADD COLUMN sizes TEXT;
ALTER TABLE products ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE orders ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE order_items ADD COLUMN size TEXT;
ALTER TABLE order_items ADD COLUMN color TEXT;
