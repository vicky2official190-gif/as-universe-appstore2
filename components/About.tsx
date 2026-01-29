
import React from 'react';
import { useApps } from '../context/AppContext';
import { Instagram, Github, Mail, Globe, MapPin, Calendar, Award, Rocket, Code, User, Briefcase, MessageCircle, Smartphone, BookOpen, Server, Users, ArrowRight, Heart } from 'lucide-react';

interface AboutProps {
  onNavigate: (view: 'store' | 'about' | 'admin') => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const { aboutData } = useApps();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 overflow-hidden relative">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-24">
        
        {/* === DEVELOPER PROFILE SECTION === */}
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Avatar Card Section - Matches the screenshot style */}
            <div className="w-full md:w-auto flex justify-center md:justify-start">
               <div className="relative group w-72 h-80 md:w-80 md:h-96">
                   {/* Neon Border Container */}
                   <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[3px] shadow-2xl animate-[glow-pulse_3s_infinite]">
                      <div className="w-full h-full bg-[#131520] rounded-[1.8rem] overflow-hidden relative">
                           {/* Avatar Image */}
                           {aboutData.imageUrl ? (
                               <img src={aboutData.imageUrl} alt={aboutData.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                           ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center bg-[#1c1f2e] text-gray-600">
                                   <User size={80} />
                                   <span className="mt-4 text-sm font-bold opacity-50">NO IMAGE</span>
                               </div>
                           )}
                           
                           {/* Floating Button Overlay */}
                           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%]">
                                <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-[1px] rounded-xl shadow-lg">
                                    <div className="bg-[#1c1f2e]/90 backdrop-blur-md rounded-xl py-3 px-4 text-center border border-white/10">
                                        <div className="flex items-center justify-center gap-2 text-white font-bold tracking-wider">
                                            <Code size={18} className="text-cyan-400"/> {aboutData.alias || 'Developer'}
                                        </div>
                                    </div>
                                </div>
                           </div>
                           
                           {/* Decorative Tech Lines */}
                           <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                      </div>
                   </div>
               </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 w-full space-y-8">
               
               {/* Header Block */}
               <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-2xl font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-3">
                          About Developer
                          <div className="h-0.5 w-12 bg-cyan-400/50 rounded-full"></div>
                      </h3>

                      {/* Join Us Button */}
                      <a 
                        href="https://whatsapp.com/channel/0029Vb6zTvX6RGJAjEHiAC0u" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold tracking-wider shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5 transform"
                      >
                        <MessageCircle size={20} className="fill-current" />
                        <span>JOIN US</span>
                      </a>
                  </div>
                  
                  <div>
                      <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Hey there! I'm <span className="text-indigo-400">{aboutData.name}</span>
                      </h1>
                      <p className="text-2xl font-bold text-cyan-400 mt-2 tracking-wide">
                        (a.k.a. {aboutData.alias})
                      </p>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-6 py-2">
                      <p className="text-xl text-gray-300 font-medium italic">
                        "{aboutData.quote}"
                      </p>
                  </div>
               </div>

               {/* Solo Developer Badge Banner */}
               <div className="bg-[#1e1b2e] border border-indigo-500/30 rounded-lg p-4 flex items-center gap-4 shadow-lg animate-in slide-in-from-right-8 duration-700 delay-100">
                   <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
                        <User size={24} />
                   </div>
                   <span className="text-indigo-200 font-semibold text-sm md:text-base tracking-wide">
                        {aboutData.roleBadge || "Solo Developer - All projects built independently"}
                   </span>
               </div>

               {/* Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Card 1: Education */}
                  <div className="bg-[#1c1f2e] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-indigo-500/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                          <Award size={24} />
                      </div>
                      <div>
                          <h4 className="text-white font-bold text-lg">Education</h4>
                          <p className="text-gray-400 text-sm">{aboutData.details.education.value}</p>
                      </div>
                  </div>

                  {/* Card 2: Location */}
                  <div className="bg-[#1c1f2e] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-cyan-500/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                          <MapPin size={24} />
                      </div>
                      <div>
                          <h4 className="text-white font-bold text-lg">Location</h4>
                          <p className="text-gray-400 text-sm">{aboutData.details.location.value}</p>
                      </div>
                  </div>

                  {/* Card 3: Birthday */}
                  <div className="bg-[#1c1f2e] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-pink-500/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                          <Calendar size={24} />
                      </div>
                      <div>
                          <h4 className="text-white font-bold text-lg">Birthday</h4>
                          <p className="text-gray-400 text-sm">{aboutData.details.birthday.value}</p>
                      </div>
                  </div>

                  {/* Card 4: Founder */}
                  <div className="bg-[#1c1f2e] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-green-500/50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                          <Rocket size={24} />
                      </div>
                      <div>
                          <h4 className="text-white font-bold text-lg">Founder</h4>
                          <p className="text-gray-400 text-sm">{aboutData.details.founder.value}</p>
                      </div>
                  </div>
               </div>
               
               {/* NEW SECTION HERE */}
               <div className="bg-gradient-to-r from-[#1c1f2e] to-[#161822] border border-white/5 rounded-2xl p-6 mt-4 hover:border-pink-500/30 transition-all flex items-center gap-6 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-pink-500/10 transition-colors"></div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-pink-400 shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.1)] group-hover:scale-105 transition-transform border border-pink-500/20">
                        <Heart size={28} className="fill-current" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Influence</h4>
                        <p className="text-lg font-medium text-white">
                            INFLUENCED BY MY FRIEND <span className="text-pink-400 font-bold">PRAKASH MAURYA</span>, I MEAN MR...
                        </p>
                    </div>
               </div>

            </div>
        </div>

      </div>
    </div>
  );
};
export default About;
