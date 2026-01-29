
import React, { useState, useEffect, useMemo } from 'react';
import { useApps } from '../context/AppContext';
import { Trash2, Pencil, CheckSquare, Lock, Save, Plus, Settings, User, Upload, Image as ImageIcon, Shield, AlertCircle, LayoutTemplate, Copy, Database, FileCode, Search, HardDrive, ChevronRight, Download, RefreshCw, FileJson, ArrowUpCircle, ArrowDownCircle, RotateCcw, Clock, Link as LinkIcon } from 'lucide-react';
import { AppItem, AboutData, StoreSettings } from '../types';

const ADMIN_PIN = "9852370453";

// Enhanced Image Compression: Supports Transparency (PNG) and optimizes size
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const target = event.target as FileReader;
      if (!target?.result) {
         return;
      }
      const img = new Image();
      img.src = target.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Increased limit to 300px for better clarity on retina screens while keeping string size manageable for code embedding
        const MAX_DIM = 300; 
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // We do NOT fill with white anymore to preserve transparency for Logos
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            // Use PNG to keep transparency, or JPEG if it was opaque (logic simplifies to PNG for logos usually)
            // If file type is jpeg, we can use jpeg to save space, otherwise png
            const outputType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
            const quality = outputType === 'image/jpeg' ? 0.7 : undefined;
            resolve(canvas.toDataURL(outputType, quality)); 
        } else {
            resolve(target.result as string);
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const AdminPanel: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { apps, deleteApp, addApp, updateApp, aboutData, updateAbout, storeSettings, updateStoreSettings } = useApps();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'profile' | 'settings' | 'data'>('list');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const storageUsage = useMemo(() => {
    let total = 0;
    try {
        for (let x in localStorage) {
            if (localStorage.hasOwnProperty(x)) {
                total += ((localStorage[x].length + x.length) * 2);
            }
        }
    } catch(e) {
        console.warn("Storage access denied");
    }
    return (total / (1024 * 1024)).toFixed(2);
  }, [apps, aboutData, storeSettings]);

  const initialFormState: Partial<AppItem> = {
    name: '', shortName: '', description: '', version: '', 
    downloads: '0', size: '', category: 'Educational', 
    isNew: true, iconColor: 'bg-indigo-500', downloadUrl: '',
    logoUrl: '', iconUrl: '', buttonText: '', rating: '4.5'
  };
  
  const [formData, setFormData] = useState<Partial<AppItem>>(initialFormState);
  const [linksJson, setLinksJson] = useState('');
  const [profileData, setProfileData] = useState<AboutData>(aboutData);
  const [settingsData, setSettingsData] = useState<StoreSettings>(storeSettings);

  useEffect(() => {
    if (activeTab === 'profile') setProfileData(aboutData);
    if (activeTab === 'settings') setSettingsData(storeSettings);
    if (activeTab === 'data') {
        const last = localStorage.getItem('as_universe_last_backup');
        if (last) setLastBackup(last);
    }
  }, [activeTab, aboutData, storeSettings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Access Denied');
      setPinInput('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleEditApp = (app: AppItem) => {
    setFormData(app);
    setLinksJson(app.links ? JSON.stringify(app.links, null, 2) : '');
    setActiveTab('form');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'app' | 'profile' | 'settings') => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const compressedBase64 = await compressImage(file);
            if (field === 'app') setFormData(prev => ({ ...prev, iconUrl: compressedBase64 })); // Legacy: upload to iconUrl
            else if (field === 'profile') setProfileData(prev => ({ ...prev, imageUrl: compressedBase64 }));
            else if (field === 'settings') setSettingsData(prev => ({ ...prev, splashLogoUrl: compressedBase64 }));
        } catch (error) {
            console.error("Image processing failed", error);
            alert("Failed to process image.");
        }
    }
  };

  const handleSubmitApp = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedLinks = undefined;
    if (linksJson.trim()) {
        try {
            parsedLinks = JSON.parse(linksJson);
        } catch (err) {
            alert("Invalid JSON in Links");
            return;
        }
    }
    const appPayload: AppItem = {
      ...formData as AppItem,
      links: parsedLinks,
      id: formData.id || Date.now().toString(),
    };
    formData.id ? updateApp(appPayload) : addApp(appPayload);
    if (window.confirm("App saved locally!\n\nDo you want to go to Data Management to backup your changes?")) {
        setActiveTab('data');
    } else {
        setActiveTab('list');
    }
    setFormData(initialFormState);
    setLinksJson('');
  };

  const generatedConstantsCode = useMemo(() => {
    return `import { AppItem, AboutData, StoreSettings } from './types';

export const APP_DATA: AppItem[] = ${JSON.stringify(apps, null, 2)};

export const CATEGORIES: string[] = ['All', 'Educational', 'New', 'Popular'];

export const INITIAL_ABOUT_DATA: AboutData = ${JSON.stringify(aboutData, null, 2)};

export const INITIAL_STORE_SETTINGS: StoreSettings = ${JSON.stringify(storeSettings, null, 2)};`;
  }, [apps, aboutData, storeSettings]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedConstantsCode);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDownloadCodeFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedConstantsCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "constants.ts";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- New: Backup & Restore Logic ---
  const handleExportBackup = () => {
      const timestamp = new Date().toLocaleString();
      const backupData = {
          apps,
          aboutData,
          storeSettings,
          timestamp: new Date().toISOString(),
          version: "1.0"
      };
      
      // Update State
      localStorage.setItem('as_universe_last_backup', timestamp);
      setLastBackup(timestamp);

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AS_Universe_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              // Basic validation
              if (json.apps && json.aboutData && json.storeSettings) {
                  if(window.confirm(`Found backup from ${json.timestamp}.\n\nThis will REPLACE all current data (Apps, Logo, Profile). Continue?`)) {
                      // Inject directly into localStorage to ensure persistence
                      localStorage.setItem('as_universe_apps', JSON.stringify(json.apps));
                      localStorage.setItem('as_universe_about', JSON.stringify(json.aboutData));
                      localStorage.setItem('as_universe_settings', JSON.stringify(json.storeSettings));
                      
                      alert("Restore Successful! The page will now reload.");
                      window.location.reload();
                  }
              } else {
                  alert("Invalid backup file. Missing required data.");
              }
          } catch (err) {
              console.error(err);
              alert("Failed to parse backup file. Please ensure it is a valid JSON file.");
          }
      };
      reader.readAsText(file);
      // Reset input value to allow re-selecting same file if needed
      e.target.value = ''; 
  };

  const handleFactoryReset = () => {
      const confirm1 = window.confirm("⚠️ DANGER: Factory Reset\n\nThis will DELETE all local changes, apps, and settings you have made.\n\nIt will revert the store to the original code defaults.");
      if (confirm1) {
          const confirm2 = window.confirm("Are you absolutely sure? This cannot be undone.");
          if (confirm2) {
              localStorage.removeItem('as_universe_apps');
              localStorage.removeItem('as_universe_about');
              localStorage.removeItem('as_universe_settings');
              localStorage.removeItem('as_universe_last_backup');
              window.location.reload();
          }
      }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      updateAbout(profileData);
      alert("Profile Saved Locally.");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
      e.preventDefault();
      updateStoreSettings(settingsData);
      if (window.confirm("✅ Settings Saved!\n\nUse 'Data Management' to Backup this configuration to a file or Sync to GitHub.\n\nGo there now?")) {
          setActiveTab('data');
      }
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <style>{`
                @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } 20%, 40%, 60%, 80% { transform: translateX(4px); } }
                .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
            `}</style>
            <div className={`bg-[#161822]/90 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl max-w-md w-full shadow-2xl relative z-10 ${isShaking ? 'animate-shake' : ''}`}>
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-[#1c1f2e] border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl">
                        <Lock size={32} className="text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight text-center">Admin Portal</h2>
                    <p className="text-gray-500 text-sm mt-2">Enter PIN to Unlock</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input type="password" placeholder="••••••••" className="w-full bg-[#0f111a] border border-white/10 p-4 rounded-xl text-white text-center text-lg tracking-[0.5em] focus:border-indigo-500 outline-none" value={pinInput} onChange={(e) => setPinInput(e.target.value)} autoFocus />
                    {errorMsg && <p className="text-red-400 text-center text-xs">{errorMsg}</p>}
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2">Unlock Console <ChevronRight size={18} /></button>
                    <button type="button" onClick={onExit} className="w-full text-gray-500 hover:text-white text-sm">Back to Store</button>
                </form>
            </div>
        </div>
    );
  }

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all w-full md:w-auto ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      <Icon size={20} />
      <span className="font-medium whitespace-nowrap">{label}</span>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Sync Warning Banner */}
      <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
          <AlertCircle className="text-yellow-500 shrink-0" size={24} />
          <p className="text-sm text-yellow-200/80">
            <strong>Maintenance Mode:</strong> Use <strong>Data Management</strong> to save your changes to a file. This is your only way to keep data without GitHub.
          </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 bg-[#1c1f2e]/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
        <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Shield size={24} /></div>
             <div>
                <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
                <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase font-bold tracking-widest"><HardDrive size={10} className="inline mr-1" /> Storage: {storageUsage}/5 MB</p>
                </div>
             </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <button onClick={onExit} className="flex-1 px-5 py-3 bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all">Store</button>
             <button onClick={() => setIsAuthenticated(false)} className="flex-1 px-5 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/10 transition-all">Lock</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 bg-[#1c1f2e] p-2 rounded-3xl border border-white/5 w-full overflow-x-auto">
        <NavItem id="list" icon={LayoutTemplate} label="Overview" />
        <NavItem id="form" icon={Plus} label="Add App" />
        <NavItem id="profile" icon={User} label="Profile" />
        <NavItem id="settings" icon={Settings} label="Settings" />
        <NavItem id="data" icon={Database} label="Data Management" />
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'list' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold text-white pl-2 border-l-4 border-indigo-500">Managed Applications ({apps.length})</h3>
                    <div className="relative w-full md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input type="text" placeholder="Quick search..." className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-2.5 pl-10 text-white outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredApps.map((app) => (
                        <div key={app.id} className="bg-[#1c1f2e] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group relative">
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${app.iconColor || 'bg-gray-700'} overflow-hidden`}>
                                        {(app.iconUrl || app.logoUrl) ? <img src={app.iconUrl || app.logoUrl} alt="" className="w-full h-full object-cover" /> : app.shortName}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg line-clamp-1">{app.name}</h4>
                                        <span className="text-xs text-gray-400">{app.version} • {app.category}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                     <button onClick={() => handleEditApp(app)} className="p-2 bg-white/5 hover:bg-indigo-600 hover:text-white text-gray-400 rounded-lg transition-all"><Pencil size={16} /></button>
                                     <button onClick={() => deleteApp(app.id)} className="p-2 bg-white/5 hover:bg-red-500 hover:text-white text-gray-400 rounded-lg transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setActiveTab('form')} className="bg-[#1c1f2e]/50 border border-white/5 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-white transition-all group min-h-[140px]">
                        <Plus size={24} /><span className="font-medium">Add Application</span>
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'form' && (
            <form onSubmit={handleSubmitApp} className="bg-[#1c1f2e] rounded-3xl border border-white/5 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500 shadow-2xl">
                <div className="bg-indigo-900/10 p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{formData.id ? 'Edit Application' : 'New Application'}</h3>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400 ml-1">App Name</label>
                            <input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 ml-1">Short Name</label>
                                <input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500" value={formData.shortName} onChange={e => setFormData({...formData, shortName: e.target.value})} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 ml-1">Version</label>
                                <input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} required />
                            </div>
                        </div>
                    </div>
                    
                    {/* URL Inputs for Static Assets */}
                    <div className="space-y-4 bg-[#0f111a]/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300">
                           <LinkIcon size={16} /> <span className="text-sm font-bold uppercase tracking-wide">External Image Links</span>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 ml-1">Main Icon URL (e.g. https://.../icon.png)</label>
                            <input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500 text-sm font-mono" value={formData.iconUrl || ''} onChange={e => setFormData({...formData, iconUrl: e.target.value})} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs text-gray-400 ml-1">Small Badge URL (Optional)</label>
                            <input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500 text-sm font-mono" value={formData.logoUrl || ''} onChange={e => setFormData({...formData, logoUrl: e.target.value})} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="space-y-4 opacity-50 hover:opacity-100 transition-opacity">
                        <label className="text-sm text-gray-400 ml-1">Or Upload Local Image (Converted to Base64)</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-20 h-20 rounded-2xl bg-[#0f111a] border border-white/10 flex items-center justify-center overflow-hidden">
                                {(formData.iconUrl && formData.iconUrl.startsWith('data:')) ? <img src={formData.iconUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600"/>}
                            </div>
                            <label className="bg-white/5 hover:bg-white/10 text-xs text-white px-4 py-3 rounded-xl cursor-pointer border border-white/5 transition-all">
                                <Upload size={16} className="inline mr-2" /> Upload Icon
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'app')} />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400 ml-1">Download URL</label>
                        <input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500" value={formData.downloadUrl} onChange={e => setFormData({...formData, downloadUrl: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-400 ml-1">Description</label>
                        <textarea className="w-full h-32 bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                </div>
                <div className="bg-[#0f111a]/50 p-6 border-t border-white/5 flex items-center justify-end">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"><Save size={18} /> Save Locally</button>
                </div>
            </form>
        )}

        {/* --- REVISED DATA MANAGEMENT TAB --- */}
        {activeTab === 'data' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <h3 className="text-2xl font-bold text-white mb-2">Data Management (Client-Side)</h3>
                <p className="text-gray-400 mb-6">Manage your store's data manually. Use Backups to keep your data safe without servers.</p>

                {/* Status Bar */}
                <div className="bg-[#1c1f2e] border border-white/5 rounded-2xl p-4 flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <Clock size={20} className="text-indigo-400" />
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Last Backup</p>
                            <p className="text-white font-medium">{lastBackup || 'Never'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                         <button onClick={handleFactoryReset} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/10 transition-colors flex items-center gap-2">
                             <RotateCcw size={14} /> Factory Reset
                         </button>
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* OPTION 1: CLIENT-SIDE BACKUP */}
                    <div className="bg-[#1c1f2e] rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="p-3 bg-green-500/10 rounded-2xl text-green-400"><FileJson size={28} /></div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Local Backup & Restore</h4>
                                <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Your "Save File"</p>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-[#0f111a] p-4 rounded-2xl border border-white/5">
                                <p className="text-sm text-gray-400 mb-4">
                                    Download a file containing your Logo, Apps, and Settings. <strong>Do this after every change.</strong>
                                </p>
                                <button onClick={handleExportBackup} className="w-full py-3 bg-white/5 hover:bg-green-600 hover:text-white rounded-xl font-bold border border-white/5 transition-all flex items-center justify-center gap-2 group-hover:border-green-500/30">
                                    <ArrowDownCircle size={18} /> Download Backup (.json)
                                </button>
                            </div>

                            <div className="bg-[#0f111a] p-4 rounded-2xl border border-white/5">
                                <p className="text-sm text-gray-400 mb-4">
                                    Restore from a backup file. Useful if you clear cookies or change devices.
                                </p>
                                <label className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg">
                                    <ArrowUpCircle size={18} /> Upload Backup File
                                    <input type="file" accept=".json" className="hidden" onChange={handleImportBackup} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* OPTION 2: SOURCE CODE SYNC */}
                    <div className="bg-[#1c1f2e] rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400"><FileCode size={28} /></div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Source Code Sync</h4>
                                <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Optional</p>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-[#0f111a] p-4 rounded-2xl border border-white/5 h-full flex flex-col justify-between">
                                <p className="text-sm text-gray-400 mb-4">
                                    Only use this if you want to hard-code your changes into the app for everyone (requires GitHub).
                                </p>
                                <div className="space-y-3">
                                    <button onClick={handleCopyCode} className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${copyFeedback ? 'bg-green-600 text-white' : 'bg-white/5 hover:bg-indigo-600 hover:text-white text-gray-300'}`}>
                                        {copyFeedback ? <><CheckSquare size={18}/> Copied!</> : <><Copy size={18}/> Copy Code</>}
                                    </button>
                                    <button onClick={handleDownloadCodeFile} className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold border border-white/5 transition-all flex items-center justify-center gap-2">
                                        <Download size={18} /> Download constants.ts
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group mt-8">
                    <div className="absolute -top-3 left-6 px-3 bg-[#1c1f2e] text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/5 rounded-full">Source Preview</div>
                    <pre className="w-full h-48 bg-[#0f111a] border border-white/5 p-6 rounded-2xl overflow-y-auto text-xs text-gray-400 font-mono scrollbar-thin">
                        {generatedConstantsCode}
                    </pre>
                </div>
             </div>
        )}

        {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-[#1c1f2e] rounded-3xl border border-white/5 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto shadow-2xl">
                 <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto bg-[#0f111a] rounded-full border-2 border-dashed border-white/20 flex items-center justify-center relative group overflow-hidden mb-4">
                        {profileData.imageUrl ? <img src={profileData.imageUrl} className="w-full h-full object-cover"/> : <User size={32} className="text-gray-600"/>}
                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold">CHANGE<input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profile')} /></label>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Edit Profile Details</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><label className="text-xs text-gray-400 ml-1 uppercase font-bold tracking-widest">Name</label><input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} /></div>
                    <div className="space-y-1"><label className="text-xs text-gray-400 ml-1 uppercase font-bold tracking-widest">Alias</label><input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500" value={profileData.alias} onChange={e => setProfileData({...profileData, alias: e.target.value})} /></div>
                    <div className="col-span-full space-y-1"><label className="text-xs text-gray-400 ml-1 uppercase font-bold tracking-widest">Quote</label><input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500" value={profileData.quote} onChange={e => setProfileData({...profileData, quote: e.target.value})} /></div>
                 </div>
                 <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg">Save Profile Locally</button>
            </form>
        )}

        {activeTab === 'settings' && (
             <form onSubmit={handleSaveSettings} className="bg-[#1c1f2e] rounded-3xl border border-white/5 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/5 pb-4">Store Configuration</h3>
                <div className="space-y-6">
                    <div className="bg-[#0f111a] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1c1f2e] shadow-xl relative bg-black/20">
                            <img src={settingsData.splashLogoUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-3">
                            {/* URL Input for Settings */}
                            <label className="text-xs text-gray-400 uppercase font-bold">Logo URL</label>
                            <input className="w-full bg-[#0f111a] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500 text-sm font-mono mb-2" value={settingsData.splashLogoUrl} onChange={e => setSettingsData({...settingsData, splashLogoUrl: e.target.value})} placeholder="https://..." />
                            
                            <label className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg">
                                <Upload size={18} /> Upload New Splash Logo
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'settings')} />
                            </label>
                            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                                <span className="text-yellow-400 font-bold">Important:</span> This updates the logo on your browser. To keep it safe, go to Data Management and download a backup.
                            </p>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg">Save Settings Locally</button>
             </form>
        )}
      </div>
    </div>
  );
};
export default AdminPanel;
