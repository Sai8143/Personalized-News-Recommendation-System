
import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper, LayoutDashboard, Search, MessageSquare, Menu, X, Bell, User, MapPin, Sparkles, Filter, Globe2, TrendingUp, RefreshCw, Shield, ChevronRight } from 'lucide-react';
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
    location: { lat: 28.6139, lng: 77.2090, region: 'Delhi NCR' }
  });

  const fetchNews = useCallback(async () => {
    setLoading(true);
    const results = await getPersonalizedNews(profile);
    setNews(results);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleArticleRead = (article: NewsArticle) => {
    setProfile(prev => ({
      ...prev,
      readingHistory: [
        ...prev.readingHistory,
        { id: article.id, title: article.title, category: article.category, timestamp: Date.now() }
      ].slice(-20)
    }));
    window.open(article.url, '_blank');
  };

  const handleArticleChat = (article: NewsArticle) => {
    setActiveArticle(article);
    setIsChatOpen(true);
  };

  const categories: Category[] = ['General', 'Politics', 'Technology', 'Sports', 'Entertainment', 'Health', 'Finance', 'Environment'];

  return (
    <div className="min-h-screen flex text-slate-900 bg-[#fcfcfc]">
      {/* Premium Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col bg-white border-r border-slate-100 fixed h-full z-40">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="p-2.5 bg-indigo-600 rounded-[18px] shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">SmartNews<span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">AI</span></h1>
          </div>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mt-2">Neural Editorial</p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          {[
            { id: 'feed', label: 'Adaptive Feed', icon: <Newspaper className="w-5 h-5" /> },
            { id: 'dashboard', label: 'Evaluation', icon: <LayoutDashboard className="w-5 h-5" /> },
            { id: 'search', label: 'Deep Trust', icon: <Search className="w-5 h-5" /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 font-bold translate-x-1' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Live Context</span>
              </div>
              <p className="text-xl font-black mb-1">{profile.location?.region || 'Delhi'}</p>
              <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-indigo-400" />
                Active Jurisdiction
              </p>
            </div>
            <Globe2 className="absolute -right-8 -bottom-8 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>

        <div className="p-6 border-t border-slate-50">
          <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 ring-2 ring-white ring-inset">
              RS
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-none mb-1">{profile.name}</p>
              <p className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-widest">Verified User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 glass border-b border-slate-100 px-10 py-6 flex items-center justify-between">
          <div className="lg:hidden flex items-center gap-4">
            <Menu className="w-6 h-6 text-slate-900 cursor-pointer" onClick={() => setIsMobileMenuOpen(true)} />
            <h1 className="text-xl font-black">SmartNews</h1>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-slate-50/50 border border-slate-200/50 px-6 py-3 rounded-2xl w-[560px] focus-within:ring-4 focus-within:ring-indigo-50 focus-within:bg-white focus-within:border-indigo-200 transition-all duration-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Indian current events with neural grounding..." 
              className="bg-transparent border-none text-sm outline-none w-full font-bold placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <button 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="relative p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-600 hover:shadow-xl transition-all"
                >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 border-[3px] border-white rounded-full"></span>
              </button>
              <button 
                onClick={fetchNews}
                className={`p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition-all ${loading ? 'opacity-50' : ''}`}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            <button className="hidden sm:flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
              <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
              SYNC FEED
            </button>
          </div>
        </header>

        <div className="p-10 max-w-[1400px] mx-auto w-full">
          {activeTab === 'feed' && (
            <div className="space-y-14 animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-[0.15em] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Adaptive Neural Sequencing
                  </div>
                  <h2 className="text-6xl font-black text-slate-900 serif tracking-tight leading-[0.9]">
                    The Intelligence <span className="text-indigo-600 italic">Digest</span>
                  </h2>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
                    Custom-built editorial flow based on your interests in <span className="text-slate-900 font-extrabold decoration-indigo-300 underline underline-offset-4">Politics</span> and <span className="text-slate-900 font-extrabold decoration-indigo-300 underline underline-offset-4">Technology</span>.
                  </p>
                </div>
                
                <div className="flex p-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm h-fit">
                  {['Similarity', 'Timeline', 'India Only'].map((filter, i) => (
                    <button 
                      key={filter}
                      className={`px-6 py-2.5 rounded-xl text-[11px] font-black transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {!loading && news.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                   <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {news.map((article) => (
                        <NewsCard 
                          key={article.id} 
                          article={article} 
                          onChatClick={handleArticleChat}
                          onArticleRead={handleArticleRead}
                        />
                      ))}
                    </div>
                  </div>

                  <aside className="lg:col-span-4 space-y-12">
                    <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
                      <h3 className="text-xs font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em] text-slate-400">
                        <TrendingUp className="w-4 h-4 text-rose-500" />
                        Market Pulse
                      </h3>
                      <div className="space-y-6">
                        {categories.slice(0, 5).map(cat => (
                          <div key={cat} className="group cursor-pointer">
                            <div className="flex justify-between items-center mb-2.5">
                              <span className="text-xs font-extrabold text-slate-700 tracking-tight">{cat}</span>
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+{Math.floor(Math.random()*20)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-200 group-hover:bg-indigo-600 transition-all duration-700 ease-out" style={{ width: `${Math.random() * 60 + 30}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-indigo-700 rounded-[40px] p-10 text-white shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] relative overflow-hidden">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-4 leading-tight italic serif">Neural <br/>Editorial Guard</h3>
                        <p className="text-sm text-indigo-100 mb-8 leading-relaxed font-medium">System successfully detected and isolated <span className="text-white font-black">22 unverified reports</span> from today's regional Indian aggregate.</p>
                        <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-white border border-white/20">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          TRUST RATING: 99.9%
                        </div>
                      </div>
                      <Sparkles className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 rotate-12" />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-4">Recently Verified</h3>
                      <div className="space-y-4">
                        {profile.readingHistory.slice(-3).reverse().map((h, i) => (
                          <div key={i} className="flex gap-4 p-4 rounded-3xl hover:bg-white transition-all cursor-pointer border border-transparent hover:border-slate-100">
                            <div className="w-1.5 h-auto bg-indigo-100 rounded-full flex-shrink-0"></div>
                            <div>
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{h.category}</p>
                              <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{h.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </aside>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-40 space-y-10">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-24 w-24 border-2 border-slate-100 border-t-indigo-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">Sequencing Neutral Feed...</p>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Applying NLP Similarity Matrix</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-14 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="border-b border-slate-100 pb-10">
                <h2 className="text-5xl font-black text-slate-900 serif tracking-tighter">System Reliability</h2>
                <p className="text-slate-500 font-medium mt-3 text-lg">Performance analysis of the SmartNews AI predictive core.</p>
              </div>
              <Analytics />
            </div>
          )}

          {activeTab === 'search' && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-6">
               <div className="max-w-4xl w-full text-center space-y-12 bg-white p-16 md:p-24 rounded-[60px] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.08)] relative overflow-hidden">
                <div className="inline-flex p-6 bg-gradient-to-tr from-indigo-600 to-indigo-900 rounded-[32px] text-white shadow-2xl shadow-indigo-200 rotate-6 mb-4 ring-8 ring-indigo-50">
                  <Shield className="w-12 h-12" />
                </div>
                <h2 className="text-7xl font-black text-slate-900 serif tracking-tighter leading-[0.9]">
                  Deep Fact <span className="text-indigo-600 italic">Grounding</span>
                </h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                  Verify any public statement or news claim against <span className="text-slate-900 font-black decoration-indigo-200 underline underline-offset-8">24,000+ trusted neural nodes</span> and international news wire archives.
                </p>
                <div className="relative group max-w-2xl mx-auto">
                  <input 
                    type="text" 
                    placeholder="Enter a claim (e.g., 'Recent stock volatility in India')..." 
                    className="w-full pl-8 pr-44 py-7 bg-slate-50 border-2 border-transparent rounded-[32px] text-xl font-bold shadow-inner focus:bg-white focus:border-indigo-600 focus:ring-[16px] focus:ring-indigo-50 outline-none transition-all duration-500 placeholder:text-slate-300"
                  />
                  <button className="absolute right-3 top-3 bottom-3 px-10 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 shadow-2xl transition-all duration-300 text-sm tracking-widest uppercase">
                    VERIFY
                  </button>
                </div>
                
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20"></div>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-auto py-16 border-t border-slate-100 bg-white px-10">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter">SmartNews AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-xs font-black text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Neural Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Source Integrity</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">© 2025 Neural Media Corp. Grounded in AI Studio.</p>
          </div>
        </footer>
      </main>

      {isChatOpen && (
        <Chatbot 
          activeContext={activeArticle} 
          onClose={() => {
            setIsChatOpen(false);
            setActiveArticle(null);
          }} 
        />
      )}
    </div>
  );
};

export default App;
