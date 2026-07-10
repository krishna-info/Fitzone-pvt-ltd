import { NextRequest, NextResponse } from 'next/server';
import { getBucket } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const bucket = getBucket();
    const key = params.key;

    if (!key) {
      return new NextResponse('Key is required', { status: 400 });
    }

    const object = await bucket.get(key);

    if (object === null) {
      return new NextResponse('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    
    // Default to webp if not set
    if (!headers.has('content-type')) {
       headers.set('content-type', 'image/webp');
    }
    
    // Cache control for images
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(object.body as unknown as BodyInit, {
      headers,
    });
  } catch (error) {
    console.error('Error fetching image from R2:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
