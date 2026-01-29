
# 🚀 AS Universe AppStore

Modern, dark-themed App Store built with React, Tailwind, and Gemini AI.

## 🛠️ Prerequisites

1.  **Node.js** installed.
2.  A **Google Gemini API Key**.

---

## ⚡ Deployment Guide (Vercel)

1.  **Push to GitHub:** Ensure your project is pushed to a GitHub repository.
2.  **Login to Vercel:** Go to [Vercel.com](https://vercel.com) and log in.
3.  **Add New Project:** Click "Add New..." -> "Project".
4.  **Import Repository:** Select your GitHub repository.
5.  **Configure Project:**
    *   **Framework Preset:** Vercel should auto-detect "Vite".
    *   **Environment Variables:** Add a new variable:
        *   **Name:** `API_KEY`
        *   **Value:** `your_gemini_api_key_here`
6.  **Deploy:** Click "Deploy".

Your app will be live in seconds!

---

## 💾 Admin Panel Guide
This app uses **LocalStorage**. To make admin changes (adding apps, changing settings) permanent for all users:
1.  Open the Admin Panel (PIN: `9852370453`).
2.  Make your changes.
3.  Go to the **"Data Management"** tab.
4.  Use **"Source Code Sync"** to copy the updated code.
5.  Update the `constants.ts` file in your source code with this new content.
6.  Commit and push to GitHub. Vercel will automatically redeploy with the new data.

## 🛠️ Tech Stack
*   React 19 & Vite
*   Tailwind CSS (CDN)
*   Google Gemini API (@google/genai)
*   Vercel (Hosting)
