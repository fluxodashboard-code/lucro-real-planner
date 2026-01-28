import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Ler versão do package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const appVersion = packageJson.version;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-charts': ['recharts'],
              'vendor-icons': ['lucide-react']
            }
          }
        }
      },
      optimizeDeps: {
        include: ['firebase']
      },
      css: {
        postcss: './postcss.config.js',
      },
      plugins: [
        react(),
        {
          name: 'inject-version',
          transformIndexHtml(html) {
            // Substitui o placeholder da versão no HTML
            return html.replace('__APP_VERSION__', appVersion);
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
