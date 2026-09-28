import { defineConfig } from 'vite';
import {fileURLToPath} from 'node:url';

export default defineConfig({
  base: './',
  build: {
    rolldownOptions: {
      input: {
        presentation: fileURLToPath(new URL('./index.html', import.meta.url)),
        guide: fileURLToPath(new URL('./guide.html', import.meta.url)),
      },
    },
  },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
