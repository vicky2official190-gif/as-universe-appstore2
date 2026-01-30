import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 🔥 VERSION CONTROL (CACHE FIX)
const APP_VERSION = 'v1.0.0';

const storedVersion = localStorage.getItem('APP_VERSION');
if (storedVersion !== APP_VERSION) {
  localStorage.setItem('APP_VERSION', APP_VERSION);
  window.location.reload();
}

// 🔹 React render
ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
