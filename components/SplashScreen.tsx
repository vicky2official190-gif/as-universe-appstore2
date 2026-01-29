import React, { useEffect, useState } from 'react';
import { useApps } from '../context/AppContext';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { storeSettings } = useApps();
  const [fade, setFade] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar simulation with variable speed for realism
    const interval = setInterval(() => {
      setProgress(prev => {
        const diff = Math.random() * 10;
        const next = prev + diff;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 150);

    // Fade out sequence
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setFade(true);
        setTimeout(onFinish, 800); // Wait for fade transition
      }, 800);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
      <div className={`fixed inset-0 z-[100] bg-[#131520] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${fade ? 'opacity-0 scale-110 filter blur-md' : 'opacity-100 scale-100'}`}>
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          
          {/* Stars / Particles */}
          {[...Array(30)].map((_, i) => (
             <div 
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                    width: Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.4,
                    animationDelay: Math.random() * 2 + 's',
                    animationDuration: Math.random() * 3 + 2 + 's'
                }}
             ></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Animated Logo Container */}
          <div className="relative mb-14">
             {/* Spinning Orbit Rings */}
             <div className="absolute inset-[-40px] border border-indigo-500/10 rounded-full animate-[orbit-cw_10s_linear_infinite]"></div>
             <div className="absolute inset-[-20px] border-t-2 border-indigo-500 rounded-full animate-[orbit-cw_3s_linear_infinite] shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
             <div className="absolute inset-[-20px] border-b-2 border-cyan-400 rounded-full animate-[orbit-ccw_3s_linear_infinite] shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
             
             {/* Central Logo Box - Replaced with Image */}
             <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#1c1f2e] flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.4)] relative z-10 animate-float overflow-hidden group border border-white/5">
                {/* Logo Image */}
                <img 
                  src={storeSettings.splashLogoUrl} 
                  alt="AS Universe" 
                  className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 z-20 pointer-events-none"></div>
             </div>
             
             {/* Core Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-3xl -z-10"></div>
          </div>

          {/* Typography */}
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-[0.15em] text-white">
                <span className="bg-gradient-to-r from-indigo-300 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">AS UNIVERSE</span>
            </h1>
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-indigo-200 tracking-[0.3em] uppercase">Loading Resources</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                </div>
            </div>
          </div>

          {/* Modern Progress Bar */}
          <div className="w-64 md:w-80 h-1.5 bg-[#0f111a] rounded-full overflow-hidden relative border border-white/5 shadow-inner">
              <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
              >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
              </div>
          </div>
          <div className="mt-2 text-xs font-mono text-gray-500">{Math.round(progress)}%</div>
          
        </div>
      </div>
    </>
  );
};
export default SplashScreen;