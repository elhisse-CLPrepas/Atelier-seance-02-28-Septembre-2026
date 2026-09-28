import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const required=[
  'index.html','src/main.js','src/style.css','package-lock.json','vite.config.js',
  'guide.html','src/guide.js','src/guide.css','src/guide-data.json','dist/guide.html',
  'public/logo-ln-ia.png',
  'public/documents-candidats/guide-presentation-seance-02-module-01.docx',
  'public/documents-candidats/fiche-candidat-seance-02-module-01.docx',
  'public/documents-candidats/guide-illustre-seance-02-module-01.pdf',
  'public/documents-candidats/cahier-pratique-seance-02-module-01.pdf',
  'dist/index.html','dist/logo-ln-ia.png',
  'dist/documents-candidats/guide-presentation-seance-02-module-01.docx',
  'dist/documents-candidats/fiche-candidat-seance-02-module-01.docx',
  'PROMPT-MAITRE-PRODUCTION-DEPLOIEMENT.md',
  'modeles-candidat/01-depart/fiche-depart-candidat.md',
  'modeles-candidat/01-depart/objectif-personnel-challenge.md',
  'modeles-candidat/02-prompts/premiers-prompts.md',
  'modeles-candidat/03-livrables/liste-premiers-livrables.md',
  'modeles-candidat/04-portfolio-preuves/preuves-semaine-01.md',
];
for(const item of required) {
  const stat = fs.statSync(path.join(root,item), {throwIfNoEntry: false});
  assert(stat?.isFile() && stat.size > 0, `Fichier manquant ou vide : ${item}`);
}
const source=fs.readFileSync(path.join(root,'src/main.js'),'utf8');
assert.equal((source.match(/^\s+slide\(/gm)||[]).length,16,'La présentation doit contenir 16 écrans');
for(const folder of ['01-depart','02-prompts','03-livrables','04-portfolio-preuves'])assert(source.includes(folder),`Dossier pédagogique absent : ${folder}`);
for (const page of ['index.html', 'guide.html']) {
const html=fs.readFileSync(path.join(root,'dist',page),'utf8');
for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  if(/^(https?:|data:)/.test(url))continue;
  assert(!url.startsWith('/'),`Chemin absolu incompatible avec un sous-dossier : ${url}`);
  const local=path.resolve(root,'dist',url.split('?')[0]);
  assert(fs.existsSync(local),`Ressource construite introuvable : ${url}`);
}
}
for(const file of ['logo-ln-ia.png','documents-candidats/guide-presentation-seance-02-module-01.docx','documents-candidats/fiche-candidat-seance-02-module-01.docx','documents-candidats/guide-illustre-seance-02-module-01.pdf','documents-candidats/cahier-pratique-seance-02-module-01.pdf']){
  assert(fs.readFileSync(path.join(root,'public',file)).equals(fs.readFileSync(path.join(root,'dist',file))),`Copie dist différente : ${file}`);
}
const forbidden = new Set(['candidats', 'reponses', 'prive', 'node_modules', '.git', '.npmrc', '.netrc', '.ssh', 'qa', '.vscode']);
function assertPublishable(relative, staged = false) {
  const segments = relative.replaceAll('\\', '/').split('/').map(segment =>
    segment.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
  for (const segment of segments) {
    const environment = /^\.env(?:\.|$)/.test(segment) && !(staged && segment === '.env.example');
    const credential = /\.(pem|key|p12|pfx)$/.test(segment) || /^id_(rsa|dsa|ecdsa|ed25519)(?:$|\.)/.test(segment);
    const localFile = segment.endsWith('.log') || segment.startsWith('~$') || ['.ds_store', 'thumbs.db'].includes(segment);
    assert(!forbidden.has(segment) && !environment && !credential && !localFile && !(staged && segment === 'dist'),
      `Élément privé ou inutile à publier : ${relative}`);
  }
}
function inspect(dir){
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    const target = path.join(dir, item.name);
    const relative = path.relative(root, target);
    assert(!item.isSymbolicLink(), `Lien symbolique à vérifier avant publication : ${relative}`);
    assertPublishable(relative);
    if(item.isDirectory())inspect(target);
  }
}
inspect(path.join(root,'public'));
inspect(path.join(root,'dist'));
if (process.argv.includes('--staged')) {
  const entries = execFileSync('git', ['ls-files', '--stage', '-z'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean);
  assert(entries.length > 0, 'Index Git vide : préparer les fichiers avant le contrôle de publication.');
  for (const entry of entries) {
    const separator = entry.indexOf('\t');
    const metadata = entry.slice(0, separator).split(' ');
    const relative = entry.slice(separator + 1);
    assert(metadata[2] === '0', `Conflit Git non résolu : ${relative}`);
    assert(['100644', '100755'].includes(metadata[0]), `Type Git à vérifier avant publication : ${relative}`);
    assertPublishable(relative, true);
  }
  console.log(`Index Git contrôlé : ${entries.length} fichiers. Vérifier aussi leur contenu avant publication.`);
}
console.log('Contrôle réussi : 16 écrans, guide interactif, cinq modèles, logo, deux Word et deux PDF ; ressources relatives, copies dist conformes et chemins de public/dist contrôlés.');
