import { NextRequest, NextResponse } from 'next/server';
import { getProductsByCategory, getAllProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '12');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    let products;
    if (category && category !== 'all') {
      products = await getProductsByCategory(category, limit, offset);
    } else {
      products = await getAllProducts(limit, offset);
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
