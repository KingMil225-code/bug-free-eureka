// Reddit OAuth Configuration
// You'll need to set these in Vercel Environment Variables
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || '';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || '';
const REDDIT_REDIRECT_URI = process.env.REDDIT_REDIRECT_URI || 'https://bug-free-eureka-ashen.vercel.app/api/callback';

export const redditAuthUrl = () => {
  const scope = 'read submit';
  const state = Math.random().toString(36).substring(7);

  return `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(REDDIT_REDIRECT_URI)}&scope=${scope}&duration=permanent`;
};

export const getAccessToken = async (code: string) => {
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDDIT_REDIRECT_URI
    })
  });

  return response.json();
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  return response.json();
};

export const searchReddit = async (accessToken: string, query: string, subreddit: string = '') => {
  const searchUrl = subreddit
    ? `https://oauth.reddit.com/r/${subreddit}/search?q=${encodeURIComponent(query)}&sort=relevance&limit=25`
    : `https://oauth.reddit.com/search?q=${encodeURIComponent(query)}&sort=relevance&limit=25`;

  const response = await fetch(searchUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'ReddFlow/1.0'
    }
  });

  return response.json();
};

export const getSubredditPosts = async (accessToken: string, subreddit: string, sort: string = 'hot', limit: number = 25) => {
  const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/${sort}?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'ReddFlow/1.0'
    }
  });

  return response.json();
};

export const postComment = async (accessToken: string, postId: string, text: string) => {
  const response = await fetch('https://oauth.reddit.com/api/comment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'ReddFlow/1.0'
    },
    body: new URLSearchParams({
      api_type: 'json',
      thing_id: postId,
      text
    })
  });

  return response.json();
};

export const getUserInfo = async (accessToken: string) => {
  const response = await fetch('https://oauth.reddit.com/api/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'ReddFlow/1.0'
    }
  });

  return response.json();
};
