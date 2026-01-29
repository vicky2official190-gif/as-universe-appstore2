
import React, { useState } from 'react';
import { AppItem } from '../types';
import { Download, ExternalLink, ChevronRight, X, Star, Zap, ShieldCheck, Info, CheckSquare, Layout } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const handleStudyAction = () => {
    if (app.links && app.links.length > 0) {
      setShowLinks(true);
    } else if (app.downloadUrl && app.downloadUrl.trim() !== '') {
      window.open(app.downloadUrl, '_blank');
    } else {
      // Fallback feedback if no link is present
      alert("Link coming soon!");
    }
  };

  // Extract a short tagline from the description (first line or truncated)
  const tagline = app.description.split('\n')[0].substring(0, 50) + (app.description.length > 50 ? '...' : '');

  // Determine Badge properties
  let badgeText = '';
  let badgeColor = '';
  if (app.isNew) {
    badgeText = 'NEW';
    badgeColor = 'bg-[#00d285] text-white'; // Vibrant Green
  } else if (app.category === 'Popular') {
    badgeText = 'POPULAR';
    badgeColor = 'bg-orange-500 text-white';
  } else {
     badgeText = 'PREMIUM';
     badgeColor = 'bg-purple-600 text-white';
  }

  // Use iconUrl as main, fallback to logoUrl for backward compat, or shortName
  const displayIcon = app.iconUrl || app.logoUrl;

  return (
    <>
      <div className="bg-[#1c1f2e] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 group relative flex flex-col w-full h-full hover:-translate-y-1">
        
        {/* Badge: Use logoUrl as small badge if present, else text badge */}
        {app.logoUrl ? (
             <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-lg bg-black/20">
                <img src={app.logoUrl} alt="Badge" className="w-full h-full object-cover" />
             </div>
        ) : (
             <div className={`absolute top-4 right-4 ${badgeColor} text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10 uppercase tracking-wide`}>
                {badgeText}
             </div>
        )}

        {/* Header Section: Icon + Name */}
        <div className="flex items-center gap-4 mb-6 pr-16">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg flex-shrink-0 ${app.iconColor || 'bg-gray-700'} ring-1 ring-white/10 overflow-hidden`}>
            {displayIcon ? (
              <img src={displayIcon} alt={app.name} className="w-full h-full object-cover" />
            ) : (
              app.shortName
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white leading-tight mb-1 truncate uppercase tracking-tight">{app.name}</h3>
            <p className="text-gray-400 text-xs font-medium truncate">{tagline}</p>
          </div>
        </div>

        {/* Stats Row (Version, Downloads, Tag) */}
        <div className="flex items-center justify-between mb-6 px-1">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-indigo-500/50 rounded-[2px] shadow-[0_0_5px_rgba(99,102,241,0.5)]"></div>
                <span className="text-gray-300 text-xs font-semibold tracking-wide">{app.version}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-indigo-500/50 rounded-[2px] shadow-[0_0_5px_rgba(99,102,241,0.5)]"></div>
                <span className="text-gray-300 text-xs font-semibold tracking-wide">{app.downloads}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-indigo-500/50 rounded-[2px] shadow-[0_0_5px_rgba(99,102,241,0.5)]"></div>
                <span className="text-gray-300 text-xs font-semibold tracking-wide">{app.shortName}</span>
             </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 mt-auto">
          <button 
            onClick={() => setShowDetails(true)}
            className="flex-1 py-3 bg-[#252836] hover:bg-[#2d3142] border border-white/5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors group-active:scale-95"
          >
             <Info size={16} className="text-gray-400 group-hover:text-white" /> Details
          </button>
          <button 
            onClick={handleStudyAction}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
             <Zap size={16} fill="currentColor" /> {app.buttonText || 'Study Now'}
          </button>
        </div>

      </div>

      {/* Details Modal (Full Description) */}
      {showDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#1c1f2e] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowDetails(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl ${app.iconColor || 'bg-gray-700'}`}>
                    {displayIcon ? <img src={displayIcon} className="w-full h-full object-cover rounded-2xl" /> : app.shortName}
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">{app.name}</h3>
                    <p className="text-indigo-400 text-sm font-medium">{app.category} • {app.version}</p>
                 </div>
              </div>

              <div className="bg-[#131520] rounded-xl p-4 border border-white/5 max-h-[50vh] overflow-y-auto custom-scrollbar mb-6">
                 <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-wider"><Layout size={14}/> About Application</h4>
                 <p className="text-gray-300 text-sm leading-7 whitespace-pre-line font-medium">
                    {app.description}
                 </p>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowDetails(false)} className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors border border-white/5">
                    Close
                 </button>
                 <button onClick={() => { setShowDetails(false); handleStudyAction(); }} className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
                    {app.links && app.links.length > 0 ? <><ExternalLink size={18}/> Open Links</> : <><Download size={18}/> {app.buttonText || 'Download Now'}</>}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Links Modal */}
      {showLinks && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1c1f2e] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowLinks(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-4">
                    <ExternalLink size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Select a Link</h3>
            </div>
            
            <div className="space-y-3">
              {app.links?.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between w-full p-4 bg-[#131520] hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 border border-white/5 rounded-xl transition-all group"
                >
                  <span className="font-semibold text-gray-200 group-hover:text-white">{link.label}</span>
                  <ChevronRight size={18} className="text-gray-500 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AppCard;
