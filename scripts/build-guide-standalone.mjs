import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'vite';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const staging = path.join(root, 'qa', 'guide-standalone');
const output = path.join(root, 'output', 'html');
await build({
  configFile: false,
  root,
  publicDir: false,
  base: './',
  define: {
    __GUIDE_OFFLINE__: 'true',
    __GUIDE_LOGO__: JSON.stringify('data:image/png;base64,' + fs.readFileSync(path.join(root, 'public/logo-ln-ia.png')).toString('base64')),
  },
  build: {
    outDir: staging,
    emptyOutDir: true,
    lib: {entry: path.join(root, 'src/guide.js'), name: 'GuideLNIA', formats: ['iife'], fileName: () => 'guide.js', cssFileName: 'guide'},
    cssCodeSplit: false,
    minify: true,
  },
});
const javascript = fs.readFileSync(path.join(staging, 'guide.js'), 'utf8');
const css = fs.readFileSync(path.join(staging, 'guide.css'), 'utf8');
let html = fs.readFileSync(path.join(root, 'guide.html'), 'utf8');
html = html.replace('</head>', () => `<style>${css.replaceAll('</style', '<\\/style')}</style>\n</head>`);
html = html.replace('<script type="module" src="/src/guide.js"></script>', () => `<script>${javascript.replaceAll('</script', '<\\/script')}</script>`);
assert(!html.includes('src="/src/guide.js"'));
assert(!/<script[^>]+src=/.test(html), 'Le HTML autonome doit intégrer son JavaScript.');
fs.mkdirSync(output, {recursive: true});
fs.writeFileSync(path.join(output, 'guide-seance-02-autonome.html'), html, 'utf8');
console.log('HTML autonome créé : output/html/guide-seance-02-autonome.html');
