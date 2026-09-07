import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // react-windowed-select's package.json "module" field points to
      // dist/index.js, which the published package never actually ships
      // (only dist/main.js exists). Point Vite straight at the real file.
      'react-windowed-select': path.resolve(
        __dirname,
        'node_modules/react-windowed-select/dist/main.js'
      ),
    },
  },
});
