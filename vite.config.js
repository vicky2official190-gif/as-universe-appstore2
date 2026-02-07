import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    // Load env file based on `mode` in the current working directory.
    // We cast process to 'any' to avoid TS errors in the Node environment configuration.
    var env = loadEnv(mode, process.cwd(), '');
    // Vercel injects environment variables into process.env.
    // We prioritize process.env for production keys.
    var apiKey = process.env.API_KEY || env.API_KEY;
    if (mode === 'production' && !apiKey) {
        console.warn("⚠️ WARNING: API_KEY is missing in production build. Chat features may not work.");
    }
    return {
        plugins: [react()],
        define: {
            // Injects the key into the client-side code at build time.
            'process.env.API_KEY': JSON.stringify(apiKey)
        },
        server: {
            host: true
        },
        build: {
            outDir: 'dist',
            sourcemap: false
        }
    };
});
