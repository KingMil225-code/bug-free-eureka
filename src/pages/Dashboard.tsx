import { useState } from 'react';
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
  Filter,
  Users,
  Target,
  Search
} from 'lucide-react';

// Mock data for threads
const mockThreads = [
  {
    id: 1,
    title: 'What are the best practices for React hooks in 2024?',
    subreddit: 'r/reactjs',
    author: 'dev_wizard',
    time: '2 hours ago',
    upvotes: 245,
    comments: 89,
    url: 'https://reddit.com/r/reactjs/...',
    relevance: 95
  },
  {
    id: 2,
    title: 'How do you price your indie SaaS product?',
    subreddit: 'r/SaaS',
    author: 'startup_founder',
    time: '4 hours ago',
    upvotes: 156,
    comments: 67,
    url: 'https://reddit.com/r/SaaS/...',
    relevance: 88
  },
  {
    id: 3,
    title: 'Building a marketing strategy with zero budget - what worked for you?',
    subreddit: 'r/marketing',
    author: 'growth_hacker',
    time: '6 hours ago',
    upvotes: 312,
    comments: 124,
    url: 'https://reddit.com/r/marketing/...',
    relevance: 82
  },
  {
    id: 4,
    title: 'NextJS 14 vs NextJS 15 - Is it worth upgrading?',
    subreddit: 'r/nextjs',
    author: 'fullstack_dev',
    time: '8 hours ago',
    upvotes: 189,
    comments: 76,
    url: 'https://reddit.com/r/nextjs/...',
    relevance: 78
  },
  {
    id: 5,
    title: 'My journey from 0 to 10k MRR in 6 months',
    subreddit: 'r/indiehackers',
    author: 'solo_creator',
    time: '12 hours ago',
    upvotes: 523,
    comments: 201,
    url: 'https://reddit.com/r/indiehackers/...',
    relevance: 72
  },
  {
    id: 6,
    title: 'Best tools for indie developers in 2025?',
    subreddit: 'r/developers',
    author: 'code_ninja',
    time: '1 day ago',
    upvotes: 298,
    comments: 145,
    url: 'https://reddit.com/r/developers/...',
    relevance: 68
  }
];

// Mock data for analytics
const mockAnalytics = {
  karma: 12450,
  karmaChange: 234,
  totalComments: 89,
  commentsThisWeek: 12,
  avgUpvotes: 45,
  topSubreddits: [
    { name: 'r/reactjs', comments: 23, upvotes: 567 },
    { name: 'r/SaaS', comments: 18, upvotes: 432 },
    { name: 'r/indiehackers', comments: 15, upvotes: 823 },
    { name: 'r/javascript', comments: 12, upvotes: 234 },
    { name: 'r/marketing', comments: 9, upvotes: 178 }
  ],
  weeklyData: [
    { day: 'Mon', comments: 3, upvotes: 45 },
    { day: 'Tue', comments: 5, upvotes: 78 },
    { day: 'Wed', comments: 2, upvotes: 34 },
    { day: 'Thu', comments: 8, upvotes: 156 },
    { day: 'Fri', comments: 4, upvotes: 67 },
    { day: 'Sat', comments: 6, upvotes: 89 },
    { day: 'Sun', comments: 7, upvotes: 123 }
  ]
};

type View = 'feed' | 'keywords' | 'analytics' | 'settings';

interface Thread {
  id: number;
  title: string;
  subreddit: string;
  author: string;
  time: string;
  upvotes: number;
  comments: number;
  url: string;
  relevance: number;
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
  const [isSearching, setIsSearching] = useState(false);

  // Filter threads based on keywords or search query
  const filteredThreads = mockThreads.filter(thread => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      // Show all threads if no search query
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
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.toLowerCase())) {
      setKeywords([...keywords, newKeyword.toLowerCase()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const generateAIReply = () => {
    setAiLoading(true);
    setTimeout(() => {
      setReplyContent(
        "Great question! Based on my experience, I'd suggest focusing on a few key areas:\n\n1. Start with a clear value proposition\n2. Validate your assumptions early with real users\n3. Focus on retention over acquisition\n\nHappy to share more details if you're working on something specific. What area are you focused on right now?"
      );
      setAiLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Guest User</p>
            <p className="text-xs text-gray-400">Free Plan</p>
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
            onChange={(e) => setFilterSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="newest">Sort by Newest</option>
            <option value="top">Sort by Top</option>
            <option value="rising">Sort by Rising</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      {(isSearching || searchQuery) && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
          <span className="text-orange-800">
            {isSearching ? `Found ${filteredThreads.length} results for "${searchQuery}"` : `Showing results for "${searchQuery}"`}
          </span>
          <button onClick={clearSearch} className="text-orange-600 hover:text-orange-800 font-medium">
            Clear Search
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
        {filteredThreads.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No threads found</p>
            <p className="text-gray-400 text-sm">Try different keywords or add more keywords to monitor</p>
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
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">{thread.subreddit}</span>
                  <span className="text-gray-400 text-xs">Posted by {thread.author}</span>
                  <span className="text-gray-400 text-xs">• {thread.time}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{thread.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {thread.upvotes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {thread.comments}
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <Target className="w-4 h-4" />
                    {thread.relevance}% match
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockAnalytics.karma.toLocaleString()}</p>
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
          <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalComments}</p>
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
          <p className="text-2xl font-bold text-gray-900">{mockAnalytics.commentsThisWeek}</p>
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
          <p className="text-2xl font-bold text-gray-900">{mockAnalytics.avgUpvotes}</p>
          <p className="text-sm text-gray-500">Avg Upvotes/Comment</p>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {mockAnalytics.weeklyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-orange-500 rounded-t"
                  style={{ height: `${(day.upvotes / 200) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Subreddits</h3>
          <div className="space-y-4">
            {mockAnalytics.topSubreddits.map((sub, index) => (
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
            ))}
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
                <MessageSquare className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Reddit Account</p>
                <p className="text-sm text-gray-500">Not connected</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Connect</button>
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
                  <p className="text-sm text-gray-500">{selectedThread.subreddit} • {selectedThread.time}</p>
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
              </div>

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
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
                    <Send className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
