import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync, spawnSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temporaryRoot = fs.realpathSync(os.tmpdir());

function copyFixture(source, destination) {
  if (fs.statSync(source).isDirectory()) {
    fs.mkdirSync(destination, {recursive: true});
    for (const name of fs.readdirSync(source)) copyFixture(path.join(source, name), path.join(destination, name));
  } else {
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.copyFileSync(source, destination);
  }
}

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(temporaryRoot, 'ln-ia-check-'));
  t.after(() => {
    const target = fs.realpathSync(directory);
    assert.equal(path.dirname(target), temporaryRoot);
    assert(path.basename(target).startsWith('ln-ia-check-'));
    fs.rmSync(target, {recursive: true, force: true});
  });
  for (const item of ['scripts/check-pack.mjs', 'index.html', 'src', 'package-lock.json',
    'vite.config.js', 'PROMPT-MAITRE-PRODUCTION-DEPLOIEMENT.md', 'modeles-candidat', 'public', 'dist']) {
    copyFixture(path.join(root, item), path.join(directory, item));
  }
  return directory;
}

function check(directory, args = []) {
  return spawnSync(process.execPath, ['scripts/check-pack.mjs', ...args], {cwd: directory, encoding: 'utf8'});
}

test('le pack livré est accepté', t => {
  const result = check(fixture(t));
  assert.equal(result.status, 0, result.stderr);
});

test('un modèle manquant est rejeté avec son chemin', t => {
  const directory = fixture(t);
  fs.unlinkSync(path.join(directory, 'modeles-candidat/02-prompts/premiers-prompts.md'));
  const result = check(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Fichier manquant ou vide : modeles-candidat\/02-prompts\/premiers-prompts.md/);
});

for (const relative of ['public/.env.production', 'dist/assets/.ENV.local',
  'public/réponses/exemple.md', 'dist/privé/exemple.md', 'public/server.pem']) {
  test(`la distribution rejette ${relative}`, t => {
    const directory = fixture(t);
    const target = path.join(directory, relative);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, 'Donnée fictive pour le test.');
    const result = check(directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Élément privé ou inutile à publier/);
  });
}

test('une copie Word différente est rejetée', t => {
  const directory = fixture(t);
  fs.appendFileSync(path.join(directory, 'dist/documents-candidats/fiche-candidat-seance-02-module-01.docx'), 'test');
  const result = check(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Copie dist différente/);
});

test('le contrôle de publication exige un index Git non vide', t => {
  const directory = fixture(t);
  execFileSync('git', ['init', '--quiet'], {cwd: directory});
  const result = check(directory, ['--staged']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Index Git vide/);
});

test('un chemin privé ajouté à Git est rejeté même hors public et dist', t => {
  const directory = fixture(t);
  execFileSync('git', ['init', '--quiet'], {cwd: directory});
  fs.writeFileSync(path.join(directory, '.env.production'), 'EXEMPLE_FICTIF=1');
  execFileSync('git', ['add', '--', '.env.production'], {cwd: directory});
  const result = check(directory, ['--staged']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Élément privé ou inutile à publier : .env.production/);
});

test('un modèle de configuration sans valeur privée est permis dans Git', t => {
  const directory = fixture(t);
  execFileSync('git', ['init', '--quiet'], {cwd: directory});
  fs.writeFileSync(path.join(directory, '.env.example'), 'EXEMPLE=');
  execFileSync('git', ['add', '--', '.env.example', 'index.html'], {cwd: directory});
  const result = check(directory, ['--staged']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Index Git contrôlé : 2 fichiers/);
});
