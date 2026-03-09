import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseCookies } from '../api/cookies';
import { searchReddit, getSubredditPosts } from '../api/reddit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Parse cookies
  req.cookies = parseCookies(req.headers.cookie);

  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { query, subreddit, sort, limit } = req.query;

  try {
    if (query) {
      const results = await searchReddit(accessToken, query as string, subreddit as string);
      return res.json(results);
    } else if (subreddit) {
      const results = await getSubredditPosts(accessToken, subreddit as string, sort as string || 'hot', Number(limit) || 25);
      return res.json(results);
    } else {
      return res.status(400).json({ error: 'Missing query or subreddit parameter' });
    }
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Reddit' });
  }
}
