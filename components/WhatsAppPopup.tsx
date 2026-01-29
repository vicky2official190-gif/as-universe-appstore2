
import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check session storage to see if already shown in this session
    const hasSeenPopup = sessionStorage.getItem('whatsapp_popup_seen');
    
    if (!hasSeenPopup) {
      // Delay showing the popup to allow the app to load and the user to get oriented
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3500); // 3.5 seconds after component mount
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('whatsapp_popup_seen', 'true');
  };

  const handleJoin = () => {
    window.open("https://whatsapp.com/channel/0029Vb6zTvX6RGJAjEHiAC0u", "_blank");
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-[#1c1f2e] border border-green-500/30 rounded-3xl w-full max-w-sm relative shadow-[0_0_50px_rgba(34,197,94,0.15)] animate-in zoom-in-95 duration-500 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-6 relative">
                 <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
                 <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl relative z-10">
                    <MessageCircle size={40} fill="currentColor" />
                 </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Join Community</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Join our WhatsApp channel to get the latest updates, premium apps, and study notes instantly!
            </p>

            <button 
                onClick={handleJoin}
                className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
                <MessageCircle size={20} fill="currentColor" /> Join WhatsApp Channel
            </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPopup;
