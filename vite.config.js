import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function localizedPages() {
  let outDir = 'dist';

  return {
    name: 'localized-pages',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const absoluteOutDir = resolve(outDir);
      const sourceIndex = resolve(absoluteOutDir, 'index.html');

      ['en', 'it'].forEach((language) => {
        const languageDir = resolve(absoluteOutDir, language);
        mkdirSync(languageDir, { recursive: true });
        copyFileSync(sourceIndex, resolve(languageDir, 'index.html'));
      });
    },
  };
}

export default defineConfig({
  plugins: [localizedPages()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
