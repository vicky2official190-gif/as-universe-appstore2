
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import AppCard from './components/AppCard';
import AdminPanel from './components/AdminPanel';
import About from './components/About';
import SplashScreen from './components/SplashScreen';
import AIChat from './components/AIChat';
import WhatsAppPopup from './components/WhatsAppPopup';
import { CATEGORIES } from './constants';
import { Search, Users, Server, Zap, Star, GraduationCap, LayoutGrid, TrendingUp, Download, ChevronRight, ArrowRight, Quote, MessageCircle } from 'lucide-react';
import { Category, AppItem } from './types';
import { AppContextProvider, useApps } from './context/AppContext';

type ViewState = 'store' | 'about' | 'admin';

// --- Helper Component to Handle Favicon Updates ---
const FaviconHandler: React.FC = () => {
  const { storeSettings } = useApps();
  
  useEffect(() => {
    if (storeSettings.splashLogoUrl) {
      // Update Standard Favicon
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.type = 'image/x-icon';
      link.href = storeSettings.splashLogoUrl;

      // Update Apple Touch Icon (Mobile Home Screen)
      let appleLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleLink);
      }
      appleLink.href = storeSettings.splashLogoUrl;
    }
  }, [storeSettings.splashLogoUrl]);

  return null;
};

const SectionHeader: React.FC<{ title: string; icon: React.ElementType; color: string; onViewAll?: () => void }> = ({ title, icon: Icon, color, onViewAll }) => (
  <div className="flex items-center justify-between mb-6 mt-12 px-2 animate-in slide-in-from-left-4 duration-500">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 backdrop-blur-md border border-white/5 shadow-lg`}>
        <Icon size={22} className={color.replace('bg-', 'text-')} />
      </div>
      <h2 className="text-2xl font-bold text-white tracking-wide">{title}</h2>
    </div>
    {onViewAll && (
      <button onClick={onViewAll} className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
        View All <ChevronRight size={16} />
      </button>
    )}
  </div>
);

const FeaturedSpotlight: React.FC<{ app: AppItem }> = ({ app }) => {
  const bgClass = app.iconColor?.replace('bg-', 'from-') || 'from-indigo-600';
  const displayIcon = app.iconUrl || app.logoUrl;
  
  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-[#1c1f2e] border border-white/5 mb-16 group cursor-pointer shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Dynamic Background Gradient */}
      <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${bgClass} to-transparent`}></div>
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>

      <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
         {/* Icon */}
         <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center text-5xl font-bold text-white ${app.iconColor} ring-4 ring-white/10 shrink-0 transform group-hover:scale-105 transition-transform duration-500`}>
            {displayIcon ? <img src={displayIcon} className="w-full h-full object-cover rounded-[2rem]" alt={app.name} /> : app.shortName}
         </div>
         
         <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
                Featured App
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-2">{app.name}</h1>
              <p className="text-xl text-gray-400 line-clamp-2 max-w-2xl mx-auto md:mx-0 font-medium leading-relaxed">{app.description}</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
               <button 
                 onClick={() => app.downloadUrl && window.open(app.downloadUrl, '_blank')}
                 className="px-8 py-4 bg-white text-black text-lg font-bold rounded-2xl hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 w-full md:w-auto justify-center"
               >
                  <Download size={22} /> Install Now
               </button>
               <div className="flex items-center gap-4 text-sm font-bold text-gray-500 bg-[#131520]/50 px-6 py-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-1.5 text-white">
                    <Star size={18} className="text-yellow-400 fill-yellow-400" /> {app.rating || '4.8'}
                  </div>
                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400">{app.category}</span>
                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400">{app.version}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const StoreContent: React.FC = () => {
  const { apps } = useApps();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "“The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.”",
    "“Technology is best when it brings people together.”",
    "“Innovation distinguishes between a leader and a follower.”",
    "“Education is the passport to the future, for tomorrow belongs to those who prepare for it today.”"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Active Learners", value: "2.8M+", icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Premium Batches", value: "15K+", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Downloads", value: "10M+", icon: Download, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Server Uptime", value: "100%", icon: Server, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  const scrollToContent = () => {
    const element = document.getElementById('store-start');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const parseDownloads = (str: string) => {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    const multiplier = str.toUpperCase().includes('M') ? 1000000 : str.toUpperCase().includes('K') ? 1000 : 1;
    return num * multiplier;
  };

  const { featuredApp, newApps, popularApps, eduApps } = useMemo(() => {
    // Determine Featured App (Prioritize New & Popular, else random new)
    const featured = apps.find(a => a.isNew && parseDownloads(a.downloads) > 100000) || apps[0];
    
    // Filter lists
    const newA = apps.filter(app => app.isNew && app.id !== featured?.id);
    const popA = apps.filter(app => !app.isNew && (app.category === 'Popular' || parseDownloads(app.downloads) >= 50000) && app.id !== featured?.id);
    const eduA = apps.filter(app => !app.isNew && app.category === 'Educational' && app.id !== featured?.id);

    return {
      featuredApp: featured,
      newApps: newA,
      popularApps: popA,
      eduApps: eduA
    };
  }, [apps]);

  // General Filter Logic
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (activeCategory !== 'All') {
        if (activeCategory === 'New' && !app.isNew) return false;
        if (activeCategory === 'Popular' && app.category !== 'Popular') return false; 
        if (activeCategory === 'Educational' && app.category !== 'Educational') return false;
        // CHANGED: Strictly match category for Downloadable items to exclude Educational web links
        if (activeCategory === 'Downloadable' && app.category !== 'Downloadable') return false;
      }
      
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.shortName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery, apps]);

  const isAllView = activeCategory === 'All' && searchQuery === '';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 animate-in fade-in duration-500 relative">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
           animation: fadeSlide 0.8s ease-out forwards;
        }
      `}</style>
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* === NEW HERO SECTION === */}
      <div className="mb-24 pt-4 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                
                {/* Text Content */}
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-6 hover:bg-white/10 transition-colors cursor-default">
                           <Zap size={14} className="fill-indigo-300"/> #1 Learning Platform
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-white mb-6">
                            Unlock Your <br/>
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">True Potential.</span>
                        </h1>
                        
                        {/* Rotating Quote */}
                        <div className="h-24 md:h-20 relative overflow-hidden max-w-2xl mx-auto">
                             {quotes.map((q, idx) => (
                                 <div key={idx} className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out transform ${idx === quoteIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                                     <p className="text-lg md:text-xl text-gray-400 font-medium italic leading-relaxed flex items-center justify-center gap-2">
                                        <Quote size={20} className="text-indigo-500 shrink-0 opacity-50 -mt-1 scale-x-[-1]" />
                                        {q}
                                     </p>
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center mt-4">
                        {/* Get Started Button - Glowing effect */}
                        <button 
                            onClick={scrollToContent}
                            className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white text-lg font-black rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] flex items-center gap-3 w-full sm:w-auto justify-center overflow-hidden ring-1 ring-white/20"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started Now <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        {/* Join Community Button - Glassmorphism with Green Hover */}
                        <a 
                            href="https://whatsapp.com/channel/0029Vb6zTvX6RGJAjEHiAC0u" 
                            target="_blank"
                            rel="noreferrer"
                            className="group relative px-10 py-5 bg-[#1c1f2e] border border-white/10 text-white text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center gap-3 w-full sm:w-auto justify-center overflow-hidden"
                        >
                             <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                             <MessageCircle size={22} className="group-hover:text-green-400 transition-colors relative z-10" />
                             <span className="relative z-10 group-hover:text-green-100 transition-colors">Join Community</span>
                             <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 translate-x-12 group-hover:-translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-6xl mx-auto">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx}
                        className="bg-[#1c1f2e]/50 backdrop-blur-md border border-white/5 p-4 md:p-6 rounded-2xl flex items-center gap-4 hover:bg-[#1c1f2e] transition-colors group"
                    >
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <h3 className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16"></div>

      {/* Search Bar */}
      <div id="store-start" className="max-w-3xl mx-auto mb-10 relative group z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-[#1c1f2e] border border-white/10 rounded-2xl flex items-center px-5 py-4 shadow-2xl transition-all group-focus-within:scale-[1.02]">
          <Search className="text-gray-400 mr-4" size={22} />
          <input 
            type="text"
            placeholder="Search for apps, mods, and tools..."
            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 text-lg font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as Category)}
            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 border text-sm tracking-wide ${
              activeCategory === cat
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] border-transparent transform scale-105'
                : 'bg-[#1c1f2e] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Content */}
      <div className="pb-20 min-h-[600px]">
        {isAllView ? (
          <div className="space-y-16">
             
             {/* Featured Spotlight */}
             {featuredApp && <FeaturedSpotlight app={featuredApp} />}

             {/* 1. FRESH ARRIVALS (Grid Layout) */}
             {newApps.length > 0 && (
               <div id="apps-section">
                  <SectionHeader title="Fresh Arrivals" icon={Zap} color="bg-yellow-500" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                      {newApps.map(app => (
                        <AppCard key={app.id} app={app} />
                      ))}
                  </div>
               </div>
             )}

             {/* 2. TRENDING NOW (Grid) */}
             {popularApps.length > 0 && (
               <div>
                  <SectionHeader title="Trending Now" icon={TrendingUp} color="bg-red-500" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {popularApps.map(app => <AppCard key={app.id} app={app} />)}
                  </div>
               </div>
             )}

             {/* 3. EDUCATIONAL HUB (Grid) */}
             {eduApps.length > 0 && (
                <div>
                  <SectionHeader title="Educational Hub" icon={GraduationCap} color="bg-green-500" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {eduApps.map(app => <AppCard key={app.id} app={app} />)}
                  </div>
                </div>
             )}
          </div>
        ) : (
          /* Filtered View */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-8">
                <LayoutGrid className="text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">{activeCategory === 'All' ? 'Search Results' : activeCategory}</h2>
                <span className="bg-[#1c1f2e] text-gray-400 text-xs px-2 py-1 rounded-md border border-white/5">{filteredApps.length}</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))
              ) : (
                <div className="col-span-full py-32 text-center opacity-50 flex flex-col items-center border-2 border-dashed border-white/5 rounded-3xl">
                  <Search size={48} className="mb-4 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-300">No apps found</p>
                  <p className="text-gray-500 mt-2">Try searching for something else</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<ViewState>('store');

  return (
    <AppContextProvider>
       {/* FaviconHandler is placed inside Provider so it can access context */}
       <FaviconHandler />
       {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
       ) : (
          <div className="min-h-screen bg-[#131520] text-white font-sans selection:bg-indigo-500/30 selection:text-white flex flex-col">
            <Navbar activeView={activeView} onNavClick={setActiveView} />
            
            <div className="flex-grow">
              {activeView === 'store' && <StoreContent />}
              {activeView === 'about' && <About onNavigate={setActiveView} />}
              {activeView === 'admin' && <div className="pt-24"><AdminPanel onExit={() => setActiveView('store')} /></div>}
            </div>

            <footer className="py-8 text-center border-t border-white/5 bg-[#131520] relative z-10 pb-28 md:pb-12">
                <p className="text-gray-600 text-[10px] font-bold tracking-[0.2em] uppercase hover:text-indigo-400 transition-colors cursor-default">
                  COPYRIGHT RESERVED AS AUNIVERSE
                </p>
            </footer>
            
            <AIChat />
            <WhatsAppPopup />
          </div>
       )}
    </AppContextProvider>
  );
};

export default App;
