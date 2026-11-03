import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || 'termite_default_secret_key_change_in_production_8923412';
}

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const expectedUser = (process.env.ADMIN_USERNAME || 'admin').trim();
  const expectedPass = (process.env.ADMIN_PASSWORD || 'admin123!').trim();

  return user === expectedUser && pass === expectedPass;
}

export function generateToken(username: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  })).toString('base64url');

  const signature = crypto
    .createHmac('sha256', getSecretKey())
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): { sub: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;

    const expectedSig = crypto
      .createHmac('sha256', getSecretKey())
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return data;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const decoded = verifyToken(token);
  return Boolean(decoded);
}

export { COOKIE_NAME };

