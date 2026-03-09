import type { VercelRequest, VercelResponse } from '@vercel/node';
import { redditAuthUrl } from '../api/reddit';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const authUrl = redditAuthUrl();
  res.redirect(authUrl);
}
