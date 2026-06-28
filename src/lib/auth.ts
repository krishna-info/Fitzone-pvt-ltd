import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

import { getCloudflareContext } from '@opennextjs/cloudflare';

const getJwtSecretKey = () => {
  let secret = process.env.JWT_SECRET;
  
  // Try to get from Cloudflare context if process.env is missing
  try {
    const env = getCloudflareContext().env as any;
    if (env?.JWT_SECRET) secret = env.JWT_SECRET;
  } catch (e) {
    // Ignore context errors
  }

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
};

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(token, getJwtSecretKey());
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function createToken(payload: { userId: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(getJwtSecretKey());
}

export async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const payload = await verifyAuth(token);
  return payload ? { user: payload } : null;
}
