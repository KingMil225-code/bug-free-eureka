import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  X,
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Clock,
  Sparkles,
  Send,
  Copy,
  RefreshCw,
  Search,
  Users,
  Target,
  LogIn,
  AlertCircle
} from 'lucide-react';

type View = 'feed' | 'keywords' | 'analytics' | 'settings';

interface RedditUser {
  name: string;
  karma: number;
  created_utc: number;
}

interface Thread {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  created_utc: number;
  ups: number;
  num_comments: number;
  permalink: string;
  selftext?: string;
  url?: string;
}

interface SearchResult {
  data: {
    children: Array<{
      data: Thread;
    }>;
  };
}

interface Analytics {
  karma: number;
  karmaChange: number;
  totalComments: number;
  commentsThisWeek: number;
  avgUpvotes: number;
  topSubreddits: Array<{ name: string; comments: number; upvotes: number }>;
  weeklyData: Array<{ day: string; comments: number; upvotes: number }>;
}

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [keywords, setKeywords] = useState(['saas', 'react', 'startup', 'marketing', 'indie']);
  const [newKeyword, setNewKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [filterSort, setFilterSort] = useState('relevance');

  // Reddit API state
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState<RedditUser | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Check Reddit authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setIsConnected(true);
          setUserInfo(data.user);
        }
      }
    } catch (err) {
      console.log('Not authenticated');
    }
  };

  const connectReddit = () => {
    window.location.href = '/api/auth';
  };

  const disconnectReddit = () => {
    // Clear cookies by calling logout endpoint
    document.cookie = 'access_token=; Max-Age=0; path=/';
    document.cookie = 'refresh_token=; Max-Age=0; path=/';
    setIsConnected(false);
    setUserInfo(null);
    setThreads([]);
  };

  const fetchThreads = async (query?: string, subreddit?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) {
        params.append('query', query);
      }
      if (subreddit) {
        params.append('subreddit', subreddit);
      }
      params.append('sort', filterSort);
      params.append('limit', '25');

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please connect your Reddit account to search');
          return;
        }
        throw new Error('Failed to fetch threads');
      }

      const data = await response.json();

      if (data.data?.children) {
        const formattedThreads = data.data.children.map((child: { data: Thread }) => ({
          id: child.data.id,
          title: child.data.title,
          subreddit: child.data.subreddit,
          author: child.data.author,
          created_utc: child.data.created_utc,
          ups: child.data.ups || 0,
          num_comments: child.data.num_comments || 0,
          permalink: child.data.permalink,
          selftext: child.data.selftext,
          url: child.data.url
        }));
        setThreads(formattedThreads);

        // Update analytics with mock data based on real threads
        setAnalytics({
          karma: userInfo?.karma || 0,
          karmaChange: Math.floor(Math.random() * 50) + 10,
          totalComments: formattedThreads.length * 2,
          commentsThisWeek: Math.floor(formattedThreads.length * 0.3),
          avgUpvotes: Math.floor(formattedThreads.reduce((sum: number, t: Thread) => sum + t.ups, 0) / formattedThreads.length) || 0,
          topSubreddits: formattedThreads.slice(0, 5).reduce((acc: Array<{ name: string; comments: number; upvotes: number }>, t: Thread) => {
            const existing = acc.find(s => s.name === t.subreddit);
            if (existing) {
              existing.comments++;
              existing.upvotes += t.ups;
            } else {
              acc.push({ name: `r/${t.subreddit}`, comments: 1, upvotes: t.ups });
            }
            return acc;
          }, []),
          weeklyData: [
            { day: 'Mon', comments: Math.floor(Math.random() * 5), upvotes: Math.floor(Math.random() * 50) },
            { day: 'Tue', comments: Math.floor(Math.random() * 5), upvotes: Math.floor(Math.random() * 50) },
            { day: 'Wed', comments: Math.floor(Math.random() * 5), upvotes: Math.floor(Math.random() * 50) },
            { day: 'Thu', comments: Math.floor(Math.random() * 5), upvotes: Math.floor(Math.random() * 50) },
            { day: 'Fri', comments: Math.floor(Math.random() * 5), upvotes: Math.floor(Math.random() * 50) },
            { day: 'Sat', comments: Math.floor(Math.random() * 5), upvotes: Math.floor(Math.random() * 50) },
            { day: 'Sun', comments: Math.floor(Math.random() * 5), upvotes: Math.floor(Math.random() * 50) }
          ]
        });
      }
    } catch (err) {
      setError('Failed to fetch threads. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const timeAgo = (timestamp: number): string => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  // Filter threads based on keywords or search query
  const filteredThreads = threads.filter(thread => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      return keywords.length > 0 ? keywords.some(kw =>
        thread.title.toLowerCase().includes(kw) ||
        thread.subreddit.toLowerCase().includes(kw) ||
        thread.author.toLowerCase().includes(kw)
      ) : true;
    }
    return thread.title.toLowerCase().includes(query) ||
           thread.subreddit.toLowerCase().includes(query) ||
           thread.author.toLowerCase().includes(query);
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchThreads(searchQuery);
    } else if (keywords.length > 0) {
      // Search with first keyword
      fetchThreads(keywords[0]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setThreads([]);
    setError(null);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.toLowerCase())) {
      const updatedKeywords = [...keywords, newKeyword.toLowerCase()];
      setKeywords(updatedKeywords);
      setNewKeyword('');
      // Fetch threads for new keyword
      fetchThreads(newKeyword.toLowerCase());
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const generateAIReply = () => {
    if (!selectedThread) return;

    setAiLoading(true);
    // Simulate AI generation with context from the thread
    setTimeout(() => {
      const threadTitle = selectedThread.title;
      const subreddit = selectedThread.subreddit;

      setReplyContent(
        `Great question about "${threadTitle}"!\n\nI've been involved in ${subreddit} for a while and here's what I've found:\n\n1. Start by understanding the core problem\n2. Focus on practical solutions that have worked for others\n3. Don't be afraid to ask follow-up questions\n\nWould love to hear about your specific situation. Feel free to DM me if you want to discuss further!`
      );
      setAiLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const postReply = async () => {
    if (!selectedThread || !replyContent.trim()) return;

    setIsPosting(true);
    setPostError(null);
    setPostSuccess(false);

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: selectedThread.id,
          text: replyContent
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }

      setPostSuccess(true);
      setTimeout(() => {
        setComposeOpen(false);
        setReplyContent('');
        setPostSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPostError(err.message || 'Failed to post comment. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">ReddFlow</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('feed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'feed' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setCurrentView('keywords')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'keywords' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Keywords</span>
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'analytics' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'settings' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {isConnected ? (
              <span className="text-orange-500 font-bold">{userInfo?.name?.charAt(0).toUpperCase()}</span>
            ) : (
              <Users className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{isConnected ? userInfo?.name : 'Guest User'}</p>
            <p className="text-xs text-gray-400">{isConnected ? `${userInfo?.karma?.toLocaleString()} karma` : 'Free Plan'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  const renderFeed = () => (
    <div className="flex-1 ml-64 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thread Feed</h1>
          <p className="text-gray-500">Discover relevant conversations in your niche</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={filterSort}
            onChange={(e) => {
              setFilterSort(e.target.value);
              if (threads.length > 0) handleSearch();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="new">Sort by Newest</option>
            <option value="top">Sort by Top</option>
            <option value="hot">Sort by Hot</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          {!isConnected && (
            <button
              onClick={connectReddit}
              className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
            >
              Connect Reddit
            </button>
          )}
        </div>
      )}

      {/* Search Results Info */}
      {threads.length > 0 && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
          <span className="text-orange-800">
            Found {filteredThreads.length} results
          </span>
          <button onClick={clearSearch} className="text-orange-600 hover:text-orange-800 font-medium">
            Clear Results
          </button>
        </div>
      )}

      {/* Active Keywords */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Active Keywords</p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
            >
              #{keyword}
              <button onClick={() => removeKeyword(keyword)} className="hover:text-orange-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Thread List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <RefreshCw className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500 text-lg">Searching Reddit...</p>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No threads found</p>
            <p className="text-gray-400 text-sm">
              {isConnected
                ? 'Try different keywords or add more keywords to monitor'
                : 'Connect your Reddit account to start searching'}
            </p>
            {!isConnected && (
              <button
                onClick={connectReddit}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Connect Reddit
              </button>
            )}
          </div>
        ) : (
          filteredThreads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => {
              setSelectedThread(thread);
              setComposeOpen(true);
            }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">r/{thread.subreddit}</span>
                  <span className="text-gray-400 text-xs">Posted by u/{thread.author}</span>
                  <span className="text-gray-400 text-xs">• {timeAgo(thread.created_utc)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{thread.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {thread.ups}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {thread.num_comments}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://reddit.com${thread.permalink}`, '_blank');
                  }}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedThread(thread);
                    setComposeOpen(true);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Reply
                </button>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );

  const renderKeywords = () => (
    <div className="flex-1 ml-64 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keyword Monitor</h1>
          <p className="text-gray-500">Track topics and get notified when relevant threads appear</p>
        </div>
      </div>

      {/* Add Keyword */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Keywords</h3>
        <p className="text-sm text-gray-500 mb-4">Enter keywords to monitor for relevant Reddit threads</p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter a keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={addKeyword}
            className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Active Keywords */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Keywords ({keywords.length})</h3>
        <p className="text-sm text-gray-500 mb-4">These keywords are being monitored for new threads</p>
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword) => (
            <div
              key={keyword}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
            >
              <span className="font-medium">#{keyword}</span>
              <button
                onClick={() => removeKeyword(keyword)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="flex-1 ml-64 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Track your Reddit engagement and growth</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ThumbsUp className="w-5 h-5 text-orange-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{analytics?.karmaChange || 0}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(analytics?.karma || userInfo?.karma || 0).toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Karma</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics?.totalComments || 0}</p>
          <p className="text-sm text-gray-500">Total Comments</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics?.commentsThisWeek || 0}</p>
          <p className="text-sm text-gray-500">This Week</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +22%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics?.avgUpvotes || 0}</p>
          <p className="text-sm text-gray-500">Avg Upvotes/Comment</p>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {(analytics?.weeklyData || []).map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-orange-500 rounded-t"
                  style={{ height: `${(day.upvotes / 200) * 100}%`, minHeight: '4px' }}
                ></div>
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Subreddits</h3>
          <div className="space-y-4">
            {(analytics?.topSubreddits || []).length > 0 ? (
              analytics?.topSubreddits.map((sub, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                    <span className="font-medium text-gray-900">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>{sub.comments} comments</span>
                    <span>{sub.upvotes} upvotes</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No data yet. Search for threads to see analytics.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex-1 ml-64 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Account</h3>
          <p className="text-sm text-gray-500 mb-4">Manage your Reddit connection</p>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                {isConnected ? (
                  <span className="text-orange-500 font-bold text-xl">{userInfo?.name?.charAt(0).toUpperCase()}</span>
                ) : (
                  <MessageSquare className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{isConnected ? `u/${userInfo?.name}` : 'Reddit Account'}</p>
                <p className="text-sm text-gray-500">{isConnected ? `${userInfo?.karma?.toLocaleString()} karma` : 'Not connected'}</p>
              </div>
            </div>
            {isConnected ? (
              <button
                onClick={disconnectReddit}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={connectReddit}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                <LogIn className="w-4 h-4" />
                Connect
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferences</h3>
          <p className="text-sm text-gray-500 mb-4">Customize your experience</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Get notified about new matching threads</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 w-20">Off</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Weekly Summary</p>
                <p className="text-sm text-gray-500">Receive weekly performance reports</p>
              </div>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg w-20">On</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription</h3>
          <p className="text-sm text-gray-500 mb-4">Manage your plan</p>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div>
              <p className="font-semibold text-gray-900">Free Plan</p>
              <p className="text-sm text-gray-500">5 keywords, 10 searches/day</p>
            </div>
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {renderSidebar()}

      {currentView === 'feed' && renderFeed()}
      {currentView === 'keywords' && renderKeywords()}
      {currentView === 'analytics' && renderAnalytics()}
      {currentView === 'settings' && renderSettings()}

      {/* Compose Modal */}
      {composeOpen && selectedThread && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Compose Reply</h2>
                  <p className="text-sm text-gray-500">r/{selectedThread.subreddit} • {timeAgo(selectedThread.created_utc)}</p>
                </div>
                <button
                  onClick={() => setComposeOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedThread.title}</p>
                {selectedThread.selftext && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{selectedThread.selftext}</p>
                )}
              </div>

              {/* Post Error */}
              {postError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{postError}</span>
                </div>
              )}

              {/* Post Success */}
              {postSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  <span className="text-green-700 text-sm">Comment posted successfully!</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Your Reply</label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="witty">Witty</option>
                  <option value="helpful">Helpful</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={generateAIReply}
                    disabled={aiLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        AI Assist
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(replyContent)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={postReply}
                    disabled={isPosting || !isConnected || !replyContent.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPosting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post
                      </>
                    )}
                  </button>
                </div>
              </div>

              {!isConnected && (
                <p className="text-sm text-orange-600 text-center">
                  Connect your Reddit account to post comments
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
