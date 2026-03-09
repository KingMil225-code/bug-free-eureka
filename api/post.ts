import type { VercelRequest, VercelResponse } from '@vercel/node';
import { postComment, getUserInfo } from '../api/reddit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { postId, text } = req.body;

  if (!postId || !text) {
    return res.status(400).json({ error: 'Missing postId or text' });
  }

  try {
    // Verify user is authenticated
    const userInfo = await getUserInfo(accessToken);

    // Post the comment
    const result = await postComment(accessToken, postId, text);

    return res.json({ success: true, data: result, user: userInfo });
  } catch (error) {
    console.error('Post error:', error);
    return res.status(500).json({ error: 'Failed to post comment' });
  }
}
