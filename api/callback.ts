import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAccessToken } from '../api/reddit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, error } = req.query;

  if (error) {
    return res.redirect('/dashboard?error=auth_failed');
  }

  try {
    const tokenData = await getAccessToken(code as string);

    if (tokenData.error) {
      console.error('Token error:', tokenData);
      return res.redirect('/dashboard?error=token_failed');
    }

    // Store tokens in cookies (in production, use secure HttpOnly cookies)
    res.setHeader('Set-Cookie', [
      `access_token=${tokenData.access_token}; Path=/; Max-Age=${tokenData.expires_in}; SameSite=Lax`,
      `refresh_token=${tokenData.refresh_token}; Path=/; Max-Age=31536000; SameSite=Lax`
    ]);

    res.redirect('/dashboard?connected=true');
  } catch (error) {
    console.error('Auth error:', error);
    res.redirect('/dashboard?error=auth_failed');
  }
}
