import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple cookie parser for Vercel serverless functions
export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.split('=').map(c => c.trim());
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

// Extend VercelRequest to include cookies
declare module '@vercel/node' {
  interface VercelRequest {
    cookies?: Record<string, string>;
  }
}
