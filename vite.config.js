import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-windowed-select': path.resolve(
        __dirname,
        'node_modules/react-windowed-select/dist/main.js'
      ),
    },
  },
});
