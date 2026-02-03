import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  publicDir: 'public',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'locales/**/*', dest: 'locales' },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
