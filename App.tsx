
import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper, LayoutDashboard, Search, MessageSquare, Menu, X, Bell, User, MapPin, Sparkles, Filter, Globe2, TrendingUp } from 'lucide-react';
import { NewsArticle, UserProfile, Category } from './types';
import { getPersonalizedNews } from './services/geminiService';
import NewsCard from './components/NewsCard';
import Chatbot from './components/Chatbot';
import Analytics from './components/Analytics';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'dashboard' | 'search'>('feed');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Rohan Sharma',
    interests: ['Technology', 'Finance', 'Politics'],
    preferredLanguages: ['English', 'Hindi'],
    readingHistory: [],
    location: { lat: 28.6139, lng: 77.2090, region: 'Delhi NCR' } // Default New Delhi
  });

  const fetchNews = useCallback(async () => {
    setLoading(true);
    const results = await getPersonalizedNews(profile);
    setNews(results);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleArticleChat = (article: NewsArticle) => {
    setActiveArticle(article);
    setIsChatOpen(true);
  };

  const categories: Category[] = ['General', 'Politics', 'Technology', 'Sports', 'Entertainment', 'Health', 'Finance', 'Environment'];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">SmartNews<span className="text-blue-600">AI</span></h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fact-Grounded News</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'feed' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Newspaper className="w-5 h-5" />
            Personalized Feed
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Insights & Trust
          </button>
          <button 
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'search' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Search className="w-5 h-5" />
            Deep Search
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-sm font-bold mb-1">India Region:</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" />
                {profile.location?.region || 'Detecting...'}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Globe2 className="w-20 h-20" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-slate-50 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              RS
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{profile.name}</p>
              <p className="text-xs text-slate-500 italic">Trusted Reader</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="lg:hidden flex items-center gap-2">
            <Menu className="w-6 h-6 text-slate-600 cursor-pointer" onClick={() => setIsMobileMenuOpen(true)} />
            <h1 className="text-lg font-bold">SmartNews AI</h1>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full w-96 border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Indian & Global news..." 
              className="bg-transparent border-none text-sm outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="relative p-2 rounded-full bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full"></span>
            </button>
            <button className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
              <Bell className="w-5 h-5" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all">
              <User className="w-4 h-4" />
              Profile
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'feed' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 serif tracking-tight flex items-center gap-3">
                    Your Daily Briefing
                    <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">Prioritizing India and your interests.</p>
                </div>
                
                <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
                  {['Latest', 'Indian', 'International', 'Verified'].map((filter) => (
                    <button 
                      key={filter}
                      className="whitespace-nowrap px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                    >
                      {filter}
                    </button>
                  ))}
                  <button className="p-2 rounded-full border border-slate-200 bg-white text-slate-600">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Featured / Trending Section Placeholder */}
              {!loading && news.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {news.map((article) => (
                        <NewsCard 
                          key={article.id} 
                          article={article} 
                          onChatClick={handleArticleChat}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-500" />
                        Trending Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <span key={cat} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-100 hover:bg-blue-50 hover:text-blue-600 cursor-pointer">
                            #{cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                      <h3 className="text-lg font-bold mb-2">Fact-Checking AI</h3>
                      <p className="text-sm text-blue-100 mb-4 opacity-90">Our AI monitors 1,000+ sources in real-time to detect misinformation. Click "Analyze" on any article to get a credibility report.</p>
                      <button className="w-full py-2.5 bg-white text-blue-700 font-bold rounded-xl text-sm shadow-md hover:bg-blue-50 transition-all">
                        Learn More
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold mb-4">News from India</h3>
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex gap-3 group cursor-pointer">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                              <img src={`https://picsum.photos/seed/ind${i}/100/100`} alt="news" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-blue-600 uppercase">Delhi</p>
                              <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">Latest developments in local infrastructure projects...</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-slate-500 font-medium animate-pulse">SmartNews AI is aggregating the latest headlines...</p>
                </div>
              )}

              {!loading && news.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400">Unable to load news. Check your connection or API key.</p>
                  <button 
                    onClick={fetchNews}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-slate-900 serif tracking-tight">Intelligence Dashboard</h2>
              <Analytics />
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-8 flex flex-col items-center justify-center py-10">
               <div className="max-w-2xl w-full text-center space-y-6">
                <div className="inline-flex p-3 bg-blue-100 rounded-2xl text-blue-600 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 serif tracking-tight">Cross-Reference Deep Search</h2>
                <p className="text-slate-500">Search for any news topic and our AI will verify it across multiple international and regional Indian sources to provide an objective truth.</p>
                <div className="relative mt-8">
                  <input 
                    type="text" 
                    placeholder="e.g., 'Recent tech layoffs in Bangalore' or 'Latest stock market trends India'" 
                    className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-200 rounded-3xl text-lg shadow-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                  </div>
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg transition-all">
                    Search AI
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto py-10 border-t border-slate-200 bg-white px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-bold">SmartNews AI</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Trust Center</a>
              <a href="#" className="hover:text-blue-600">Contact</a>
            </div>
            <p className="text-xs text-slate-400">© 2025 SmartNews AI. Grounded in Fact-Checking Technology.</p>
          </div>
        </footer>
      </main>

      {/* Chatbot Toggle */}
      {isChatOpen && (
        <Chatbot 
          activeContext={activeArticle} 
          onClose={() => {
            setIsChatOpen(false);
            setActiveArticle(null);
          }} 
        />
      )}

      {/* Mobile Menu Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold">SmartNews AI</h1>
              <X className="w-6 h-6 text-slate-600" onClick={() => setIsMobileMenuOpen(false)} />
            </div>
             <nav className="space-y-2">
              <button 
                onClick={() => { setActiveTab('feed'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'feed' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
              >
                <Newspaper className="w-5 h-5" />
                Feed
              </button>
              <button 
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Insights
              </button>
              <button 
                onClick={() => { setActiveTab('search'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'search' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
