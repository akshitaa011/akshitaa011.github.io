import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'html-dev-entry',
      apply: 'serve',
      transformIndexHtml(html) {
        if (html.includes('assets/index.js')) {
          html = html.replace(/<script[^>]*src=["'][^"']*assets\/index\.js["'][^>]*><\/script>/i, '<script type="module" src="/src/main.jsx"></script>');
          html = html.replace(/<link[^>]*href=["'][^"']*assets\/index\.css["'][^>]*>/i, '');
        }
        return html;
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
  },
})

