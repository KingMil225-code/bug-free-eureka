import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseCookies } from '../api/cookies';
import { getUserInfo } from '../api/reddit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Parse cookies
  req.cookies = parseCookies(req.headers.cookie);

  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userInfo = await getUserInfo(accessToken);
    return res.json({ user: userInfo });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
