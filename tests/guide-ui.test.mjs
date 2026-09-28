import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Window} from 'happy-dom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundle = fs.readFileSync(path.join(root, 'qa/guide-standalone/guide.js'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/guide-data.json'), 'utf8'));

function setup(t, hash = '') {
  const win = new Window({url: `https://example.test/guide.html${hash}`});
  t.after(() => win.happyDOM.abort());
  win.document.body.innerHTML = '<a class="skip" href="#guide-content">Aller au contenu</a><div id="guide-app"></div><div id="guide-status"></div>';
  const downloads = [];
  const blobs = [];
  win.URL.createObjectURL = blob => { blobs.push(blob); return 'blob:test'; };
  win.URL.revokeObjectURL = () => {};
  win.document.addEventListener('click', event => {
    const link = event.target.closest?.('a[download]');
    if (link && link.href.startsWith('blob:')) { event.preventDefault(); downloads.push(link.download); }
  });
  win.eval(bundle);
  const go = id => { win.history.replaceState(null, '', '#' + id); win.dispatchEvent(new win.HashChangeEvent('hashchange')); };
  return {win, doc: win.document, go, downloads, blobs};
}

test('les huit chapitres et les deux téléchargements sont accessibles', t => {
  const {doc, go} = setup(t);
  assert.equal(doc.querySelectorAll('[data-chapter]').length, 8);
  for (const chapter of data.chapters) {
    go(chapter.id);
    assert.equal(doc.querySelector('h1').textContent, chapter.title);
    assert.equal(doc.querySelector('[aria-current="page"]').dataset.chapter, chapter.id);
  }
  assert.equal(doc.querySelector('#reading-count').textContent, '8 / 8');
  go('telechargements');
  assert.equal(doc.querySelectorAll('.pdf-card[download]').length, 2);
  assert(doc.querySelector('.pdf-card').href.includes('/pdf/guide-illustre'));
});

test('un lien direct ouvre le chapitre et une ancre incorrecte garde une page utilisable', t => {
  const {doc, go} = setup(t, '#prompt');
  assert.equal(doc.querySelector('h1').textContent, 'Améliorer puis décider');
  go('%ZZ');
  assert(doc.querySelector('.hero'));
});

test('Aller au contenu conserve la page de téléchargements', t => {
  const {win, doc} = setup(t, '#telechargements');
  doc.querySelector('.skip').click();
  assert.equal(win.location.hash, '#telechargements');
  assert.equal(doc.activeElement.id, 'guide-content');
});

test('la recherche ignore les accents et indique une absence de résultat', t => {
  const {win, doc} = setup(t);
  const search = doc.querySelector('#chapter-search');
  search.value = 'beneficiaire'; search.dispatchEvent(new win.Event('input'));
  assert(doc.querySelectorAll('[data-chapter]:not([hidden])').length > 0);
  search.value = 'zzzzzzzzzzz'; search.dispatchEvent(new win.Event('input'));
  assert.equal(doc.querySelectorAll('[data-chapter]:not([hidden])').length, 0);
  assert.equal(doc.querySelector('#search-empty').hidden, false);
});

test('les étapes de méthode montrent le contrôle humain', t => {
  const {doc} = setup(t, '#methode');
  doc.querySelector('[data-step="3"]').click();
  assert.equal(doc.querySelector('[data-step="3"]').getAttribute('aria-pressed'), 'true');
  assert.equal(doc.querySelectorAll('[data-step][aria-pressed="true"]').length, 1);
  assert(doc.querySelector('#cycle-detail').textContent.includes('Comparer les faits'));
});

test('le brouillon reste du texte et survit à un changement de chapitre', async t => {
  const {win, doc, go, downloads, blobs} = setup(t, '#objectif');
  const field = doc.querySelector('[data-draft="depart"]');
  field.value = '<script>Texte fictif</script> & un exemple';
  field.dispatchEvent(new win.Event('input'));
  go('methode'); go('objectif');
  assert.equal(doc.querySelector('[data-draft="depart"]').value, field.value);
  assert.equal(doc.querySelectorAll('#guide-content script').length, 0);
  doc.querySelector('#export-draft').click();
  assert.equal(downloads.at(-1), 'objectif-personnel-challenge.md');
  assert((await blobs.at(-1).text()).includes(field.value));
});

test('le bilan conserve les statuts choisis et les exporte', async t => {
  const {win, doc, go, blobs} = setup(t, '#bilan');
  const status = doc.querySelector('[data-check="0"]');
  assert.equal(status.value, 'Non vérifié');
  status.value = 'À compléter'; status.dispatchEvent(new win.Event('change'));
  go('suite'); go('bilan');
  assert.equal(doc.querySelector('[data-check="0"]').value, 'À compléter');
  doc.querySelector('#export-bilan').click();
  assert((await blobs.at(-1).text()).includes('À compléter'));
});

test('le minuteur passe en pause puis revient à huit minutes', t => {
  const {doc} = setup(t, '#objectif');
  assert.equal(doc.querySelector('#writing-time').textContent, '08:00');
  doc.querySelector('#timer-start').click();
  assert.equal(doc.querySelector('#timer-start').textContent, 'Pause');
  doc.querySelector('#timer-start').click();
  assert.notEqual(doc.querySelector('#timer-start').textContent, 'Pause');
  doc.querySelector('#timer-reset').click();
  assert.equal(doc.querySelector('#writing-time').textContent, '08:00');
});

test('les prompts se téléchargent et le menu se ferme avec Échap', async t => {
  const {win, doc, downloads, blobs} = setup(t, '#prompt');
  doc.querySelector('[data-save="0"]').click();
  assert.equal(downloads.at(-1), 'prompt-objectif-personnel.md');
  assert.equal(await blobs.at(-1).text(), data.chapters[3].blocks[0].text + '\n');
  doc.querySelector('#menu-toggle').click();
  assert.equal(doc.querySelector('#menu-toggle').getAttribute('aria-expanded'), 'true');
  doc.dispatchEvent(new win.KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
  assert.equal(doc.querySelector('#menu-toggle').getAttribute('aria-expanded'), 'false');
});
