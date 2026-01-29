import React from 'react';
import { ShoppingBag, Info, Shield, Sparkles } from 'lucide-react';
import { useApps } from '../context/AppContext';

type ViewState = 'store' | 'about' | 'admin';

interface NavbarProps {
  onAdminClick?: () => void;
  activeView: ViewState;
  onNavClick: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, onNavClick }) => {
  const { storeSettings } = useApps();
  const navItems = [
    { id: 'store' as ViewState, label: 'Store', icon: ShoppingBag },
    { id: 'about' as ViewState, label: 'About', icon: Info },
    { id: 'admin' as ViewState, label: 'Admin', icon: Shield },
  ];

  return (
    <>
      {/* --- DESKTOP & HEADER LAYOUT --- */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          
          {/* Brand Logo - Floating Glass Capsule */}
          <div 
            onClick={() => onNavClick('store')}
            className="bg-[#1c1f2e]/80 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 cursor-pointer transition-transform hover:scale-105 group pr-6"
          >
            {/* Increased Logo Size */}
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-indigo-500/50 transition-colors">
               {storeSettings.splashLogoUrl ? (
                   <img src={storeSettings.splashLogoUrl} className="w-full h-full object-cover" alt="AS Universe Logo"/>
               ) : (
                   <Sparkles size={18} className="text-indigo-400 group-hover:text-white transition-colors" />
               )}
            </div>
            <span className="font-bold bg-gradient-to-r from-indigo-200 via-white to-cyan-200 bg-clip-text text-transparent tracking-wider text-sm md:text-base">
              AS UNIVERSE
            </span>
          </div>

          {/* Desktop Navigation - Centered Floating Island */}
          <div className="hidden md:flex bg-[#1c1f2e]/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`
                  relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  flex items-center gap-2 overflow-hidden
                  ${activeView === item.id ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {activeView === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full -z-10 shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-in fade-in zoom-in duration-300"></div>
                )}
                <item.icon size={16} className={activeView === item.id ? 'animate-pulse' : ''} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Spacer for Flexbox balance on desktop (optional, keeps logo left) */}
          <div className="hidden md:block w-[140px]"></div> 
        </div>
      </div>

      {/* --- MOBILE BOTTOM DOCK --- */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-500">
        <div className="bg-[#1c1f2e]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex justify-between items-center p-1.5 px-6">
           {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`
                  flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 relative group
                  ${activeView === item.id ? 'text-white flex-1' : 'text-gray-500 flex-1'}
                `}
              >
                 <div className={`
                    p-2.5 rounded-xl mb-1 transition-all duration-300 relative
                    ${activeView === item.id ? 'bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-cyan-300 -translate-y-1' : 'group-hover:text-gray-300'}
                 `}>
                    {activeView === item.id && (
                        <div className="absolute inset-0 bg-indigo-400/20 blur-lg rounded-full"></div>
                    )}
                    <item.icon size={22} strokeWidth={activeView === item.id ? 2.5 : 2} />
                 </div>
                 {activeView === item.id && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,1)]"></span>
                 )}
              </button>
           ))}
        </div>
      </div>
    </>
  );
};
export default Navbar;