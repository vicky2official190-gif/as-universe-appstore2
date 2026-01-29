import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppItem, AboutData, StoreSettings } from '../types';
import { APP_DATA, INITIAL_ABOUT_DATA, INITIAL_STORE_SETTINGS } from '../constants';

interface AppContextType {
  apps: AppItem[];
  aboutData: AboutData;
  storeSettings: StoreSettings;
  addApp: (app: AppItem) => void;
  updateApp: (app: AppItem) => void;
  deleteApp: (id: string) => void;
  updateAbout: (data: AboutData) => void;
  updateStoreSettings: (data: StoreSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage if available, otherwise use default constants
  const [apps, setApps] = useState<AppItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('as_universe_apps');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse apps from local storage");
        }
      }
    }
    return APP_DATA;
  });

  const [aboutData, setAboutData] = useState<AboutData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('as_universe_about');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse about data from local storage");
        }
      }
    }
    return INITIAL_ABOUT_DATA;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('as_universe_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse store settings from local storage");
        }
      }
    }
    return INITIAL_STORE_SETTINGS;
  });

  // Persist to LocalStorage whenever state changes with Error Handling
  useEffect(() => {
    try {
      localStorage.setItem('as_universe_apps', JSON.stringify(apps));
    } catch (error) {
      console.error("LocalStorage Save Error (Quota Exceeded?):", error);
      alert("⚠️ Storage Full! Changes could not be saved. Please delete some apps or use smaller images.");
    }
  }, [apps]);

  useEffect(() => {
    try {
      localStorage.setItem('as_universe_about', JSON.stringify(aboutData));
    } catch (error) {
      console.error("LocalStorage Save Error:", error);
      alert("⚠️ Storage Full! Profile changes could not be saved.");
    }
  }, [aboutData]);

  useEffect(() => {
    try {
      localStorage.setItem('as_universe_settings', JSON.stringify(storeSettings));
    } catch (error) {
      console.error("LocalStorage Save Error:", error);
      alert("⚠️ Storage Full! Settings could not be saved.");
    }
  }, [storeSettings]);

  const addApp = (app: AppItem) => setApps(prev => [...prev, app]);
  
  const updateApp = (updatedApp: AppItem) => {
    setApps(prevApps => prevApps.map(app => app.id === updatedApp.id ? updatedApp : app));
  };

  const deleteApp = (id: string) => setApps(prev => prev.filter(a => a.id !== id));
  const updateAbout = (data: AboutData) => setAboutData(data);
  const updateStoreSettings = (data: StoreSettings) => setStoreSettings(data);

  return (
    <AppContext.Provider value={{ apps, aboutData, storeSettings, addApp, updateApp, deleteApp, updateAbout, updateStoreSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApps = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApps must be used within AppContextProvider');
  return context;
};