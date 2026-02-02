import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  publicDir: 'public',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'components/**/*', dest: 'components' },
        { src: 'locales/**/*', dest: 'locales' },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
