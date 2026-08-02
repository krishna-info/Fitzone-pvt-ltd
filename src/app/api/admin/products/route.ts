import { NextRequest, NextResponse } from 'next/server';
import { getDb, getBucket } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { PRODUCT_CATEGORIES } from '@/lib/product-types';

function extractErrorMessage(error: any, fallback: string): string {
  const causeMsg = error?.cause?.message || error?.cause;
  const rawMsg = error?.message || (typeof causeMsg === 'string' ? causeMsg : '') || String(error || '');
  const lowerMsg = (rawMsg + ' ' + (typeof causeMsg === 'string' ? causeMsg : '')).toLowerCase();

  console.error('[API Admin Products Error]', {
    message: error?.message,
    cause: error?.cause,
    rawMsg,
    stack: error?.stack
  });

  if (lowerMsg.includes('unique') || lowerMsg.includes('constraint') || lowerMsg.includes('sqlite_stat')) {
    return 'A product with this slug or name already exists. Please choose a unique name or slug.';
  }

  const cleaned = rawMsg
    .split('\n')[0]
    .replace(/at (?:D1DatabaseSession|cloudflare-internal|worker).*/g, '')
    .trim();

  return cleaned && cleaned !== 'Error' && !cleaned.startsWith('at ') ? cleaned : fallback;
}

async function processImages(formData: FormData): Promise<string[]> {
  const imageFiles = formData.getAll('images') as File[];
  const existingImagesRaw = formData.get('existing_images') as string;
  let finalImages: string[] = [];

  try {
    finalImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
  } catch {
    finalImages = [];
  }

  try {
    const bucket = getBucket();
    if (bucket) {
      for (const file of imageFiles) {
        if (file && typeof file !== 'string' && file.size > 0 && file.name) {
          const arrayBuf = await file.arrayBuffer();
          if (!arrayBuf || arrayBuf.byteLength === 0) continue;
          
          const buffer = Buffer.from(arrayBuf);
          const imageKey = `products/${crypto.randomUUID()}.webp`;
          try {
            await bucket.put(imageKey, buffer, {
              httpMetadata: { contentType: 'image/webp' }
            });
            const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
            if (r2BaseUrl) {
              finalImages.push(`${r2BaseUrl.replace(/\/$/, '')}/${imageKey}`);
            }
          } catch (uploadError) {
            console.error('Failed to upload image file to R2 bucket:', uploadError);
          }
        }
      }
    }
  } catch (bucketError) {
    console.error('Error during image processing:', bucketError);
  }

  return finalImages;
}

async function generateUniqueSlug(db: any, rawSlug: string, name: string, currentId?: string): Promise<string> {
  let base = (rawSlug || '').trim().toLowerCase();
  if (!base && name) {
    base = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (!base) {
    base = 'product';
  }

  if (!db) return base;

  let candidate = base;
  let counter = 1;
  const cleanId = (currentId || '').trim();

  for (let i = 0; i < 50; i++) {
    try {
      let query = 'SELECT id FROM products WHERE slug = ?';
      let stmt;
      if (cleanId) {
        query += ' AND id != ?';
        stmt = db.prepare(query).bind(candidate, cleanId);
      } else {
        stmt = db.prepare(query).bind(candidate);
      }

      const { results } = await stmt.all();
      if (!results || results.length === 0) {
        return candidate;
      }
      candidate = `${base}-${counter++}`;
    } catch (error) {
      console.error('Error checking slug uniqueness in D1:', error);
      return candidate;
    }
  }

  return candidate;
}

// POST - Create New Product
export async function POST(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database connection unavailable.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const id = crypto.randomUUID();

    const name = (formData.get('name') as string)?.trim();
    if (!name) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }

    const rawSlug = (formData.get('slug') as string)?.trim();
    const category_slug = (formData.get('category_slug') as string)?.trim() || 'default';

    const rawPrice = formData.get('price_inr') as string;
    const price_inr = parseFloat(rawPrice);
    if (isNaN(price_inr) || price_inr < 0) {
      return NextResponse.json({ error: 'Please submit a valid non-negative numeric price.' }, { status: 400 });
    }

    const moq = parseInt(formData.get('moq') as string) || 1;
    const description = (formData.get('description') as string)?.trim() || '';
    const rawActive = formData.get('is_active');
    const is_active = (rawActive === 'true' || rawActive === '1') ? 1 : 0;

    const rawEnquiry = formData.get('is_enquiry_only');
    const is_enquiry_only = (rawEnquiry === 'true' || rawEnquiry === '1') ? 1 : 0;

    const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';
    const slug = await generateUniqueSlug(db, rawSlug, name);

    let colorsArray: string[] = ['Black', 'Navy', 'Heather Gray', 'White'];
    try {
      const colorsRaw = formData.get('colors') as string;
      if (colorsRaw) {
        const parsed = typeof colorsRaw === 'string' ? JSON.parse(colorsRaw) : colorsRaw;
        if (Array.isArray(parsed)) colorsArray = parsed;
      }
    } catch {}

    let sizesArray: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
    try {
      const sizesRaw = formData.get('sizes') as string;
      if (sizesRaw) {
        const parsed = typeof sizesRaw === 'string' ? JSON.parse(sizesRaw) : sizesRaw;
        if (Array.isArray(parsed)) sizesArray = parsed;
      }
    } catch {}

    let featuresArray: string[] = [];
    try {
      const featuresRaw = formData.get('features') as string;
      if (featuresRaw) {
        const parsed = typeof featuresRaw === 'string' ? JSON.parse(featuresRaw) : featuresRaw;
        if (Array.isArray(parsed)) featuresArray = parsed;
      }
    } catch {}

    let customSpecs: Record<string, string> = {};
    try {
      const specsRaw = formData.get('specifications') as string;
      if (specsRaw) {
        const parsed = typeof specsRaw === 'string' ? JSON.parse(specsRaw) : specsRaw;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          customSpecs = parsed;
        }
      }
    } catch {}

    const specifications: Record<string, string> = {
      ...customSpecs,
      _colors: JSON.stringify(colorsArray),
      _sizes: JSON.stringify(sizesArray),
      _features: JSON.stringify(featuresArray)
    };

    const images = await processImages(formData);

    await db.prepare(`
      INSERT INTO products (id, name, slug, category, category_slug, price_inr, moq, images, description, specifications, is_enquiry_only, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      id,
      name ?? '',
      slug ?? '',
      category ?? 'Default',
      category_slug ?? 'default',
      price_inr ?? 0,
      moq ?? 1,
      JSON.stringify(images || []),
      description ?? '',
      JSON.stringify(specifications || {}),
      is_enquiry_only ?? 0,
      is_active ?? 0
    ).run();

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return NextResponse.json({ success: true, id, slug });
  } catch (error: any) {
    const errorMsg = extractErrorMessage(error, 'Failed to create product via API.');
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// PUT - Update Existing Product
export async function PUT(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database connection unavailable.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const id = (formData.get('id') as string)?.trim();
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for updating.' }, { status: 400 });
    }

    const name = (formData.get('name') as string)?.trim();
    if (!name) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }

    const rawSlug = (formData.get('slug') as string)?.trim();
    const category_slug = (formData.get('category_slug') as string)?.trim() || 'default';

    const rawPrice = formData.get('price_inr') as string;
    const price_inr = parseFloat(rawPrice);
    if (isNaN(price_inr) || price_inr < 0) {
      return NextResponse.json({ error: 'Please submit a valid non-negative numeric price.' }, { status: 400 });
    }

    const moq = parseInt(formData.get('moq') as string) || 1;
    const description = (formData.get('description') as string)?.trim() || '';
    const rawActive = formData.get('is_active');
    const is_active = (rawActive === 'true' || rawActive === '1') ? 1 : 0;

    const rawEnquiry = formData.get('is_enquiry_only');
    const is_enquiry_only = (rawEnquiry === 'true' || rawEnquiry === '1') ? 1 : 0;

    const category = PRODUCT_CATEGORIES.find(c => c.slug === category_slug)?.name || 'Default';
    const slug = await generateUniqueSlug(db, rawSlug, name, id);

    let colorsArray: string[] = ['Black', 'Navy', 'Heather Gray', 'White'];
    try {
      const colorsRaw = formData.get('colors') as string;
      if (colorsRaw) {
        const parsed = typeof colorsRaw === 'string' ? JSON.parse(colorsRaw) : colorsRaw;
        if (Array.isArray(parsed)) colorsArray = parsed;
      }
    } catch {}

    let sizesArray: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
    try {
      const sizesRaw = formData.get('sizes') as string;
      if (sizesRaw) {
        const parsed = typeof sizesRaw === 'string' ? JSON.parse(sizesRaw) : sizesRaw;
        if (Array.isArray(parsed)) sizesArray = parsed;
      }
    } catch {}

    let featuresArray: string[] = [];
    try {
      const featuresRaw = formData.get('features') as string;
      if (featuresRaw) {
        const parsed = typeof featuresRaw === 'string' ? JSON.parse(featuresRaw) : featuresRaw;
        if (Array.isArray(parsed)) featuresArray = parsed;
      }
    } catch {}

    let customSpecs: Record<string, string> = {};
    try {
      const specsRaw = formData.get('specifications') as string;
      if (specsRaw) {
        const parsed = typeof specsRaw === 'string' ? JSON.parse(specsRaw) : specsRaw;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          customSpecs = parsed;
        }
      }
    } catch {}

    const specifications: Record<string, string> = {
      ...customSpecs,
      _colors: JSON.stringify(colorsArray),
      _sizes: JSON.stringify(sizesArray),
      _features: JSON.stringify(featuresArray)
    };

    const images = await processImages(formData);

    await db.prepare(`
      UPDATE products SET name = ?, slug = ?, category = ?, category_slug = ?, price_inr = ?, moq = ?, images = ?, description = ?, specifications = ?, is_enquiry_only = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      name ?? '',
      slug ?? '',
      category ?? 'Default',
      category_slug ?? 'default',
      price_inr ?? 0,
      moq ?? 1,
      JSON.stringify(images || []),
      description ?? '',
      JSON.stringify(specifications || {}),
      is_enquiry_only ?? 0,
      is_active ?? 0,
      id ?? ''
    ).run();

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${category_slug}`);
    revalidatePath(`/products/${category_slug}/${slug}`);
    return NextResponse.json({ success: true, id, slug });
  } catch (error: any) {
    const errorMsg = extractErrorMessage(error, 'Failed to update product via API.');
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// DELETE - Remove Product
export async function DELETE(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database connection unavailable.' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id')?.trim();

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id?.trim();
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for deletion.' }, { status: 400 });
    }

    await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    const errorMsg = extractErrorMessage(error, 'Failed to delete product via API.');
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
