import './guide.css';
import guide from './guide-data.json';

const offline = typeof __GUIDE_OFFLINE__ !== 'undefined' && __GUIDE_OFFLINE__;
const base = import.meta.env.BASE_URL;
const documents = offline ? '../pdf/' : `${base}documents-candidats/`;
const logo = typeof __GUIDE_LOGO__ !== 'undefined' ? __GUIDE_LOGO__ : `${base}logo-ln-ia.png`;
const presentation = offline ? 'https://elhisse-clprepas.github.io/Atelier-seance-02-28-Septembre-2026/' : `${base}index.html`;
const pdfs = [
  {filename: 'guide-illustre-seance-02-module-01.pdf', title: 'Le guide illustré', detail: 'Sommaire cliquable et signets', label: 'Comprendre', icon: 'book'},
  {filename: 'cahier-pratique-seance-02-module-01.pdf', title: 'Le cahier pratique', detail: '8 pages · 54 champs à remplir', label: 'Mettre en pratique', icon: 'pen'},
];
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
const icons = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  down: '<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',
  book: '<path d="M12 5v15M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/>',
  pen: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  folder: '<path d="M3 7V4h6l3 3h9v13H3Z"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.arrow}</svg>`;
const state = {visited: new Set(), drafts: {}, checks: {}, timer: {remaining: 480, deadline: null, interval: null}};
const announce = text => { document.getElementById('guide-status').textContent = text; };
const route = () => location.hash.slice(1) || 'accueil';
const download = (filename, content) => {
  const url = URL.createObjectURL(new Blob([content], {type: 'text/markdown;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  announce('Téléchargement demandé. Vérifiez le fichier dans vos téléchargements.');
};

function shell() {
  document.getElementById('guide-app').innerHTML = `
    <aside class="sidebar" id="guide-sidebar" aria-label="Sommaire du guide">
      <a class="brand" href="#accueil" aria-label="LN-IA · Accueil du guide"><img src="${logo}" alt="LN-IA" /></a>
      <p class="rail-label">LE CARNET DE LA SÉANCE 02</p>
      <a class="home-link" href="#accueil">${icon('book')} Vue d’ensemble</a>
      <label class="search"><span class="visually-hidden">Rechercher un chapitre</span>${icon('search')}<input id="chapter-search" type="search" placeholder="Trouver un chapitre…" autocomplete="off" /></label>
      <nav class="chapter-nav" aria-label="Chapitres">${guide.chapters.map(ch => `<a data-chapter="${ch.id}" href="#${ch.id}"><span class="nav-number">${ch.number}</span><span>${esc(ch.short)}</span><span class="nav-done" aria-hidden="true"></span></a>`).join('')}</nav>
      <p id="search-empty" class="search-empty" hidden>Aucun chapitre trouvé.</p>
      <div class="rail-progress"><div><span>Chapitres consultés</span><strong id="reading-count">0 / 8</strong></div><progress id="reading-progress" max="8" value="0" aria-label="Chapitres consultés"></progress><small>Repère de lecture pour cet onglet.</small></div>
      <a class="presentation-link" href="${presentation}">Retour à la présentation ${icon('arrow')}</a>
      <p class="rail-signature">Prof. Abderrahman EL HISSE<br><span>Challenge 100 Jours · LN-IA</span></p>
    </aside>
    <div class="workspace"><header class="topbar"><button id="menu-toggle" class="menu-button" aria-controls="guide-sidebar" aria-expanded="false">Sommaire</button><div class="breadcrumb">MODULE 01 <span>/</span> <b>Le guide interactif</b></div><a class="top-download" href="#telechargements">Les deux PDF ${icon('down')}</a></header>
    <main id="guide-content" tabindex="-1"></main>
    <footer class="site-footer"><span>LN-IA · Séance 02 · 28 septembre 2026</span><span>Comprendre. Essayer. Vérifier.</span></footer></div>`;
  document.getElementById('menu-toggle').addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    document.getElementById('menu-toggle').setAttribute('aria-expanded', String(open));
  });
  document.getElementById('chapter-search').addEventListener('input', event => {
    const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const query = normalize(event.target.value.trim());
    let found = 0;
    document.querySelectorAll('[data-chapter]').forEach((link, index) => {
      const match = normalize(JSON.stringify(guide.chapters[index])).includes(query);
      link.hidden = !match;
      if (match) found++;
    });
    document.getElementById('search-empty').hidden = found !== 0;
  });
  document.querySelector('.skip').addEventListener('click', event => {
    event.preventDefault();
    document.getElementById('guide-content').focus();
  });
}

function pdfCards() {
  return `<div class="pdf-grid">${pdfs.map(pdf => `<a class="pdf-card" href="${documents + pdf.filename}" download><span class="pdf-icon">${icon(pdf.icon)}</span><span class="pdf-description"><span class="eyebrow">${pdf.label}</span><strong>${pdf.title}</strong><span>${pdf.detail}</span></span><span class="download-icon">${icon('down')}</span></a>`).join('')}</div>`;
}

function journey() {
  return `<div class="journey" aria-label="De l’intention à une première preuve"><div class="journey-top"><span class="eyebrow">LE FIL DE VOTRE TRAVAIL</span><span class="mini-badge">7 étapes</span></div>
  <div class="journey-start"><span class="node-icon">01</span><div><small>JE PRÉCISE</small><strong>Une intention claire</strong></div></div>
  <div class="journey-branch"><span>02 · Prompt</span><span>03 · Production</span></div>
  <div class="human-node"><span class="pulse-dot"></span><div><small>LE MOMENT DÉCISIF</small><strong>Je contrôle.<br>Je choisis ma correction.</strong></div><span class="human-label">04 + 05</span></div>
  <div class="journey-finish"><div><small>06 · CLASSEMENT</small><strong>Un fichier retrouvé</strong></div>${icon('arrow')}<div><small>07 · PREUVE</small><strong>Un choix expliqué</strong></div></div><p>Vous gardez la décision à chaque étape.</p></div>`;
}

function home() {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="live-dot"></span> SÉANCE 02 · 28 SEPTEMBRE 2026</p><h1>Une intention.<br>Un travail concret.<br><em>Une première preuve.</em></h1><p class="hero-lead">Votre guide pour préciser un objectif, travailler avec l’IA et expliquer les choix que vous retenez.</p><div class="hero-actions"><a class="button primary" href="#reperes">Commencer le parcours ${icon('arrow')}</a><a class="text-link" href="#telechargements">Emporter les PDF</a></div><div class="hero-author"><span class="author-mark">AE</span><span><strong>Prof. Abderrahman EL HISSE</strong><small>Professeur agrégé de physique · Formateur et coach</small></span></div></div>${journey()}</section>
  <section class="metrics" aria-label="Repères de la séance"><div><strong>100<span> min</span></strong><p>pour pratiquer ensemble</p></div><div><strong>3<span> livrables</span></strong><p>à définir pendant l’atelier</p></div><div><strong>4<span> dossiers</span></strong><p>pour retrouver votre travail</p></div><div><strong>1<span> preuve</span></strong><p>datée et expliquée</p></div></section>
  <section class="section"><div class="section-heading"><div><p class="eyebrow">LE PARCOURS</p><h2>Huit chapitres, à votre rythme.</h2></div><p>Un repère, un exemple et une action à réaliser.</p></div><div class="chapter-grid">${guide.chapters.map(ch => `<a href="#${ch.id}" class="chapter-card"><span class="card-index">${ch.number}</span><span class="card-time">${esc(ch.time)}</span><h3>${esc(ch.title)}</h3><p>${esc(ch.intro.split('. ')[0])}.</p><span class="card-bottom">Explorer le chapitre ${icon('arrow')}</span></a>`).join('')}</div></section>
  <section class="section home-pdfs"><div class="section-heading"><div><p class="eyebrow">À GARDER SOUS LA MAIN</p><h2>Deux PDF pour passer à l’action.</h2></div></div>${pdfCards()}</section>
  <aside class="closing-note"><span>${icon('check')}</span><p><strong>Définir aujourd’hui, réaliser progressivement.</strong> Les trois projets ne doivent pas être terminés pendant ces 100 minutes. Votre premier résultat : un objectif corrigé et une preuve du travail effectué.</p></aside>`;
}

function renderBlock(block, index) {
  const heading = `<h2>${esc(block.title)}</h2>`;
  switch (block.type) {
    case 'text': return `<section class="lesson-block">${heading}<p>${esc(block.text)}</p></section>`;
    case 'callout': return `<aside class="callout"><span>${icon('check')}</span><div><h3>${esc(block.title)}</h3><p>${esc(block.text)}</p></div></aside>`;
    case 'quote': return `<figure class="quote"><figcaption>${esc(block.title)}</figcaption><blockquote>« ${esc(block.text)} »</blockquote></figure>`;
    case 'list': return `<section class="lesson-block">${heading}<${block.ordered ? 'ol' : 'ul'} class="action-list">${block.items.map(item => `<li>${esc(item)}</li>`).join('')}</${block.ordered ? 'ol' : 'ul'}></section>`;
    case 'table': return `<section class="lesson-block">${heading}<div class="table-scroll" tabindex="0" aria-label="${esc(block.title)}"><table><thead><tr>${block.heads.map(head => `<th scope="col">${esc(head)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row => `<tr>${row.map((cell, i) => `<${i ? 'td' : 'th scope="row"'}>${esc(cell)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
    case 'rubrics': return `<section class="lesson-block">${heading}<div class="rubric-grid">${block.items.map((item, i) => `<div><span>0${i + 1}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div>`).join('')}</div></section>`;
    case 'prompt': return `<section class="lesson-block prompt-block">${heading}<div class="prompt-toolbar"><span>À PERSONNALISER</span><div><button data-copy="${index}">Copier</button><button data-save="${index}" aria-label="Télécharger ${esc(block.title)} en Markdown">${icon('down')} .md</button></div></div><pre tabindex="0">${esc(block.text)}</pre></section>`;
    case 'cycle': return `<section class="lesson-block">${heading}<p class="helper">Sélectionnez une étape pour découvrir votre rôle.</p><div class="cycle-steps">${block.steps.map((step, i) => `<button data-step="${i}" aria-pressed="${i === 0}" class="${i === 0 ? 'selected' : ''}"><span>0${i + 1}</span>${esc(step.name)}</button>`).join('')}</div><div id="cycle-detail" class="cycle-detail" aria-live="polite"><span>01</span><div><h3>${esc(block.steps[0].name)}</h3><p>${esc(block.steps[0].text)}</p></div></div></section>`;
    case 'folders': return `<section class="lesson-block">${heading}<div class="folder-tree">${block.folders.map((folder, i) => `<details ${i === 0 ? 'open' : ''}><summary>${icon('folder')}<strong>${folder.name}</strong><span>${esc(folder.role)}</span></summary><ul>${folder.files.map(file => `<li><code>${esc(file)}</code></li>`).join('')}</ul></details>`).join('')}</div></section>`;
    case 'checklist': return `<section class="lesson-block">${heading}<div class="checklist">${block.items.map((item, i) => `<label><span>${esc(item)}</span><select data-check="${i}" aria-label="Statut : ${esc(item)}">${['Non vérifié', 'À compléter', 'Réalisé'].map(value => `<option ${state.checks[i] === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>`).join('')}</div><button class="button secondary" id="export-bilan">Télécharger mon bilan ${icon('down')}</button></section>`;
    case 'links': return `<section class="lesson-block">${heading}<div class="resource-links">${block.items.map(item => `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${esc(item.text)} ${icon('arrow')}</a>`).join('')}</div></section>`;
    default: return '';
  }
}

function draftPanel() {
  const fields = [{id: 'depart', title: 'Mon point de départ', placeholder: 'Mon activité, mon expérience, ma difficulté…'}, {id: 'production', title: 'Ce que je veux apprendre à produire', placeholder: 'Pour qui ? Quel besoin ? Quel résultat ?'}, {id: 'preuves', title: 'Mes preuves attendues', placeholder: 'Les fichiers et les contrôles que je pourrai montrer…'}, {id: 'livrables', title: 'Mes trois premiers livrables', placeholder: 'Trois réalisations nommées et distinctes…'}];
  return `<section class="practice"><div class="practice-heading"><div><p class="eyebrow">À VOUS DE PRODUIRE</p><h2>Essayez vos quatre rubriques.</h2></div><div class="timer-panel"><output id="writing-time" aria-label="Temps restant">08:00</output><div><button id="timer-start">Démarrer</button><button id="timer-reset" aria-label="Réinitialiser les huit minutes">Repartir</button></div></div></div><p>Votre texte reste dans cet onglet. Téléchargez-le avant de fermer ou de recharger la page.</p><div class="draft-grid">${fields.map(field => `<label>${esc(field.title)}<textarea data-draft="${field.id}" rows="4" placeholder="${esc(field.placeholder)}">${esc(state.drafts[field.id] || '')}</textarea></label>`).join('')}</div><button class="button primary" id="export-draft">Télécharger mon objectif en .md ${icon('down')}</button><p class="helper">Enregistrez le fichier dans votre dossier 01-depart. Aucun texte n’est transmis par cette page.</p></section>`;
}

function chapterPage(chapter) {
  const index = guide.chapters.indexOf(chapter);
  return `<article class="lesson"><header class="lesson-header"><a href="#accueil" class="back-link">← Vue d’ensemble</a><div class="lesson-meta"><span class="eyebrow">${esc(chapter.phase)}</span><span class="time-chip">${esc(chapter.time)}</span></div><p class="chapter-numeral">CHAPITRE ${chapter.number} / 08</p><h1>${esc(chapter.title)}</h1><p class="lesson-intro">${esc(chapter.intro)}</p></header><div class="lesson-body">${chapter.blocks.map(renderBlock).join('')}${chapter.id === 'objectif' ? draftPanel() : ''}<div class="next-action"><span>VOTRE PROCHAINE ACTION</span><p>${esc(chapter.action)}</p></div></div><nav class="lesson-pagination" aria-label="Parcourir les chapitres"><a href="#${index ? guide.chapters[index - 1].id : 'accueil'}">← ${index ? esc(guide.chapters[index - 1].short) : 'Vue d’ensemble'}</a><a href="#${index < 7 ? guide.chapters[index + 1].id : 'telechargements'}">${index < 7 ? esc(guide.chapters[index + 1].short) : 'Les deux PDF'} ${icon('arrow')}</a></nav></article>`;
}

function resources() {
  return `<section class="downloads-page"><p class="eyebrow">LIRE, ÉCRIRE, CONSERVER</p><h1>Votre guide,<br><em>à portée de main.</em></h1><p class="lesson-intro">Un guide illustré pour comprendre et un cahier pour passer à l’action. Retrouvez les mêmes repères dans le PDF et dans le parcours interactif.</p>${pdfCards()}<div class="download-notes"><section><span>01</span><h2>Parcourir le guide</h2><p>Utilisez le sommaire cliquable, les signets du lecteur PDF et le lien Sommaire en bas des pages.</p></section><section><span>02</span><h2>Remplir le cahier</h2><p>Écrivez dans les champs, enregistrez une copie puis rouvrez-la pour vérifier vos réponses. Vous pouvez aussi imprimer le cahier.</p></section><section><span>03</span><h2>Conserver sa preuve</h2><p>Gardez les documents remplis dans votre espace personnel et utilisez le canal privé convenu avec le formateur.</p></section></div><div class="source-note"><h2>Le document de référence</h2><p>Adaptation du Guide de présentation de la séance 02 du Module 01, édition du 28 septembre 2026, par Prof. Abderrahman EL HISSE.</p>${!offline ? `<a class="text-link" href="${documents}guide-presentation-seance-02-module-01.docx" download>Télécharger le guide Word d’origine ${icon('down')}</a>` : '<p>Le fichier HTML autonome accompagne les deux PDF placés dans le dossier voisin pdf.</p>'}</div></section>`;
}

function render(focus = false) {
  const id = route();
  const chapter = guide.chapters.find(ch => ch.id === id);
  const target = document.getElementById('guide-content');
  if (chapter) state.visited.add(id);
  target.innerHTML = chapter ? chapterPage(chapter) : id === 'telechargements' ? resources() : home();
  document.title = `${chapter?.title || (id === 'telechargements' ? 'Les deux PDF' : 'Le guide interactif')} · LN-IA`;
  document.querySelectorAll('[data-chapter]').forEach(link => {
    const active = link.dataset.chapter === id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    link.querySelector('.nav-done').textContent = state.visited.has(link.dataset.chapter) ? '•' : '';
  });
  document.getElementById('reading-count').textContent = `${state.visited.size} / 8`;
  document.getElementById('reading-progress').value = state.visited.size;
  document.body.classList.remove('menu-open');
  document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');
  bindChapter(chapter);
  updateTimer();
  if (focus) { target.focus({preventScroll: true}); window.scrollTo(0, 0); }
}

function bindChapter(chapter) {
  if (!chapter) return;
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(chapter.blocks[Number(button.dataset.copy)].text);
      button.textContent = 'Copié'; announce('Prompt copié. Personnalisez les champs avant utilisation.');
    } catch { announce('Copie indisponible. Sélectionnez le texte ou téléchargez le fichier .md.'); button.textContent = 'Utiliser .md'; }
  }));
  document.querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => {
    const block = chapter.blocks[Number(button.dataset.save)]; download(block.filename, block.text + '\n');
  }));
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.step);
    const step = chapter.blocks.find(block => block.type === 'cycle').steps[index];
    document.querySelectorAll('[data-step]').forEach(item => { const active = item === button; item.classList.toggle('selected', active); item.setAttribute('aria-pressed', String(active)); });
    document.getElementById('cycle-detail').innerHTML = `<span>0${index + 1}</span><div><h3>${esc(step.name)}</h3><p>${esc(step.text)}</p></div>`;
  }));
  document.querySelectorAll('[data-draft]').forEach(field => field.addEventListener('input', () => { state.drafts[field.dataset.draft] = field.value; }));
  document.getElementById('export-draft')?.addEventListener('click', () => {
    const labels = {depart: 'Mon point de départ', production: 'Ce que je veux apprendre à produire', preuves: 'Mes preuves attendues', livrables: 'Mes trois premiers livrables'};
    download('objectif-personnel-challenge.md', '# Mon objectif personnel\n\n' + Object.entries(labels).map(([key, title]) => `## ${title}\n\n${state.drafts[key] || '[À compléter]'}\n`).join('\n'));
  });
  document.querySelectorAll('[data-check]').forEach(select => select.addEventListener('change', () => { state.checks[select.dataset.check] = select.value; }));
  document.getElementById('export-bilan')?.addEventListener('click', () => download('bilan-seance-02.md', '# Mon bilan de la séance 02\n\n' + chapter.blocks.find(block => block.type === 'checklist').items.map((item, i) => `- ${item} : ${state.checks[i] || 'Non vérifié'}`).join('\n')));
  document.getElementById('timer-start')?.addEventListener('click', () => {
    const timer = state.timer;
    if (timer.deadline) {
      timer.remaining = Math.max(0, Math.ceil((timer.deadline - Date.now()) / 1000)); timer.deadline = null;
      clearInterval(timer.interval); timer.interval = null;
    } else if (timer.remaining > 0) {
      timer.deadline = Date.now() + timer.remaining * 1000;
      timer.interval = setInterval(() => {
        if (Date.now() >= timer.deadline) { timer.remaining = 0; timer.deadline = null; clearInterval(timer.interval); timer.interval = null; announce('Les huit minutes sont écoulées. Enregistrez votre objectif.'); }
        updateTimer();
      }, 250);
    }
    updateTimer();
  });
  document.getElementById('timer-reset')?.addEventListener('click', () => { clearInterval(state.timer.interval); Object.assign(state.timer, {remaining: 480, deadline: null, interval: null}); updateTimer(); });
}

function updateTimer() {
  const output = document.getElementById('writing-time');
  if (!output) return;
  const {remaining, deadline} = state.timer;
  const seconds = deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : remaining;
  output.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const button = document.getElementById('timer-start');
  button.textContent = deadline ? 'Pause' : remaining === 480 ? 'Démarrer' : 'Reprendre';
  button.disabled = seconds === 0;
}

shell();
window.addEventListener('hashchange', () => render(true));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
    document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');
    document.getElementById('menu-toggle').focus();
  }
});
render();
