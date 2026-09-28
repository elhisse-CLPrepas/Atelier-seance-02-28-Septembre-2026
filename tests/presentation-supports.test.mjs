import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {build} from 'vite';
import {Window} from 'happy-dom';

test('les trois supports sont accessibles dès l’accueil et sur les seize écrans sous le chemin publié', async t => {
  const result = await build({
    configFile: false, publicDir: false, base: './', logLevel: 'silent',
    build: {write: false, lib: {entry: fileURLToPath(new URL('../src/main.js', import.meta.url)), name: 'PresentationLNIA', formats: ['iife']}},
  });
  const script = result[0].output.find(item => item.type === 'chunk').code;
  const base = 'https://elhisse-clprepas.github.io/Atelier-seance-02-28-Septembre-2026/';
  const win = new Window({url: base});
  t.after(() => win.happyDOM.abort());
  win.document.body.innerHTML = '<a class="skip-link" href="#content">Aller au contenu</a><div id="app"></div><div id="status"></div>';
  win.eval(script);
  const expected = ['guide.html', 'documents-candidats/guide-illustre-seance-02-module-01.pdf', 'documents-candidats/cahier-pratique-seance-02-module-01.pdf'];
  const verify = () => {
    const bar = win.document.querySelector('nav[aria-label="Supports de la séance"]');
    assert(bar, 'La barre doit être présente sans ouvrir Ressources');
    assert.equal(bar.hidden, false);
    const links = [...bar.querySelectorAll('a')];
    assert.deepEqual(links.map(link => link.href), expected.map(file => base + file));
    assert.equal(links.filter(link => link.hasAttribute('download')).length, 2);
    for (const file of expected) assert(fs.existsSync(new URL('../dist/' + file, import.meta.url)), file);
  };
  verify();
  for (const hash of [...Array.from({length: 16}, (_, i) => `#slide/${i + 1}`), '#ressources']) {
    win.history.replaceState(null, '', hash);
    win.dispatchEvent(new win.HashChangeEvent('hashchange'));
    verify();
  }
  assert.equal(win.document.querySelectorAll('.download-links a').length, 5);
});
