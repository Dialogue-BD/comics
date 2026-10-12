import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

// Fixed file names (so a rebuild overwrites rather than piling up hashed copies
// in the repo) plus a ?v=<content hash> query so browsers never keep a stale build.
function cacheBust() {
  return {
    name: 'cache-bust',
    writeBundle(opts, bundle) {
      const out = opts.dir;
      const htmlPath = path.join(out, 'index.html');
      let html = fs.readFileSync(htmlPath, 'utf8');
      for (const f of Object.keys(bundle)) {
        if (!/\.(js|css)$/.test(f)) continue;
        const h = createHash('md5').update(fs.readFileSync(path.join(out, f))).digest('hex').slice(0, 8);
        html = html.split(`./${f}"`).join(`./${f}?v=${h}"`);
      }
      fs.writeFileSync(htmlPath, html);
    }
  };
}

export default defineConfig({
  base: './',
  // audio lives beside the built page in ../audio, not in the bundle
  publicDir: false,
  plugins: [react(), cacheBust()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    target: 'es2019',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/voice-lab.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
        manualChunks: undefined
      }
    }
  }
});
