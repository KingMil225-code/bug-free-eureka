import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  TrendingUp,
  Search,
  BarChart3,
  Shield,
  Zap,
  Brain,
  Target,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  Star,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Search,
      title: 'Thread Finder',
      description: 'Discover the exact threads where your audience is active. Find high-intent discussions in your niche instantly.'
    },
    {
      icon: Brain,
      title: 'AI Composer',
      description: 'Get AI-powered suggestions for your replies. Craft thoughtful, engaging comments that resonate.'
    },
    {
      icon: TrendingUp,
      title: 'Track Growth',
      description: 'Monitor your karma, comment engagement, and audience growth over time with detailed analytics.'
    },
    {
      icon: Target,
      title: 'Keyword Monitoring',
      description: 'Set up alerts for keywords that matter to you. Never miss a relevant conversation.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your Reddit credentials stay secure. We use OAuth for safe authentication.'
    },
    {
      icon: Zap,
      title: 'Quick Replies',
      description: 'Draft and schedule your responses efficiently. Be first to engage with trending topics.'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Comments Analyzed' },
    { value: '10M+', label: 'Impressions Tracked' },
    { value: '4.9', label: 'User Rating' },
    { value: '99.5%', label: 'Uptime' }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        '5 keyword monitors',
        '10 thread searches/day',
        'Basic AI suggestions',
        '7-day history',
        'Community support'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '19',
      description: 'For serious Reddit marketers',
      features: [
        'Unlimited keyword monitors',
        'Unlimited thread searches',
        'Advanced AI composer',
        'Full analytics history',
        'Priority support',
        'Export data',
        'Custom alerts'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Business',
      price: '49',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'White-label reports',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Do I need a Reddit account?',
      answer: 'Yes, you need to connect your Reddit account via OAuth to use the dashboard features. We never store your password.'
    },
    {
      question: 'Is it safe to use?',
      answer: 'Absolutely. We use Reddit\'s official OAuth API and never post on your behalf without your explicit approval. You always review and approve all content.'
    },
    {
      question: 'Can I get banned for using this?',
      answer: 'No. ReddFlow is designed to help you engage authentically. All features work within Reddit\'s terms of service.'
    },
    {
      question: 'How does the AI composer work?',
      answer: 'Our AI analyzes the thread context and suggests relevant, helpful responses. You can edit, approve, or discard any suggestion before posting.'
    },
    {
      question: 'Can I use it for multiple accounts?',
      answer: 'Currently, we support one Reddit account per subscription. Multi-account support is on our roadmap.'
    }
  ];

  const handleGetStarted = () => {
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ReddFlow</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
              <button
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <button
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded-lg font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Now with AI-Powered Reply Suggestions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Build Your Reddit Presence
              <span className="text-orange-500"> Effortlessly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              The personal Reddit engagement manager that helps you find relevant threads,
              craft better responses, and grow your influence authentically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-medium rounded-lg inline-flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                className="px-8 py-3 text-lg font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-gray-600 font-medium">4.9/5 from 2,000+ users</span>
              </div>
              <p className="text-gray-500">Trusted by indie hackers, creators, and marketers worldwide</p>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="bg-gray-900 rounded-2xl p-2 md:p-4 shadow-2xl">
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-6 grid md:grid-cols-3 gap-6">
                  {/* Mock Dashboard */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold">Thread Feed</h3>
                        <span className="text-gray-400 text-sm">Live</span>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">r/javascript</span>
                            <span className="text-gray-400 text-xs">2h ago</span>
                          </div>
                          <p className="text-white text-sm font-medium">Best practices for React hooks in 2024?</p>
                          <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> 245</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 89</span>
                          </div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">r/SaaS</span>
                            <span className="text-gray-400 text-xs">4h ago</span>
                          </div>
                          <p className="text-white text-sm font-medium">How do you price your indie SaaS?</p>
                          <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> 156</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 67</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-3">Your Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Karma</span>
                          <span className="text-white font-semibold">12,450</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Comments</span>
                          <span className="text-white font-semibold">89</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">This Week</span>
                          <span className="text-green-400 font-semibold">+234</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-3">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">#saas</span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">#react</span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">#startup</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">#marketing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed on Reddit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for individual creators and indie hackers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and start growing your Reddit presence
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Connect Reddit',
                description: 'Sign in with your Reddit account using secure OAuth'
              },
              {
                step: '2',
                title: 'Set Keywords',
                description: 'Add topics and keywords you want to monitor'
              },
              {
                step: '3',
                title: 'Find Threads',
                description: 'Discover relevant conversations in your niche'
              },
              {
                step: '4',
                title: 'Engage & Grow',
                description: 'Draft responses, track your growth, build authority'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free, upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 ${
                  plan.popular
                    ? 'ring-2 ring-orange-500 shadow-xl scale-105'
                    : 'border border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price !== '0' && <span className="text-gray-500">/month</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about ReddFlow
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Reddit Presence?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of creators who are growing their influence on Reddit
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-orange-500 hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-lg inline-flex items-center"
          >
            Get Started for Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ReddFlow</span>
              </div>
              <p className="text-gray-400">
                The personal Reddit engagement manager for creators and indie hackers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ReddFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with ❤️ for Reddit creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
