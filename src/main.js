import './style.css';

export const masterPrompt = `Tu es mon assistant pédagogique pour le Challenge 100 Jours LN-IA.
Je souhaite clarifier mon objectif personnel pour une formation pratique.
Voici mon brouillon :
[coller mon texte après retrait des informations privées inutiles]
Mon public ou bénéficiaire : [à compléter].
Mes contraintes de temps et de moyens : [à compléter].
Améliore la clarté de mon texte sans changer mon intention. Utilise seulement les faits que je fournis. Si une information indispensable manque, pose au maximum trois questions avant de rédiger. Ne crée ni expérience, ni compétence, ni résultat déjà obtenu. Ne promets pas de résultat irréaliste.
Présente une synthèse courte en quatre rubriques : mon point de départ, ce que je veux apprendre à produire, mes preuves attendues, mes trois premiers livrables. Vise dix lignes de contenu environ. Garde les détails dans une liste séparée si nécessaire.
Après cette synthèse, indique les éléments que je dois encore confirmer. Je relirai et choisirai moi-même la version finale.`;

export const correctionPrompt = `Corrige uniquement les points suivants :
1. Remplace la promesse de tout maîtriser par la création d’une fiche de trois exercices de circuits électriques avec corrigé.
2. Ajoute un contrôle humain des unités, des calculs et du niveau des questions.
3. Retire la plateforme et toute durée que je n’ai pas confirmée.
Garde mon public et mon intention. Donne une version courte que je pourrai relire avant de l’enregistrer.`;

export const proofTemplate = `# Preuves de la semaine 01

## Séance 02 du 28 septembre 2026
Date de réalisation : [date réelle]
Objectif travaillé : [une phrase]
Fichier examiné : 01-depart/objectif-personnel-challenge.md
Version ou date de révision : [à renseigner]
Prompt conservé dans : 02-prompts/premiers-prompts.md
Contrôle réalisé : [ce que j’ai vérifié]
Résultat observé : [ce que j’ai constaté]
Correction décidée : [modification précise]
Ce que je sais expliquer : [geste ou choix]
Élément restant à compléter : [action]
Prochaine action et date cible : [à renseigner]
Capture ou pièce associée : [chemin, si disponible]
Relecture par une autre personne : [nom et date, seulement si réalisée]`;

const files = {
  objectif: '01-depart/objectif-personnel-challenge.md',
  prompts: '02-prompts/premiers-prompts.md',
  livrables: '03-livrables/liste-premiers-livrables.md',
  preuve: '04-portfolio-preuves/preuves-semaine-01.md',
};
const file = (name) => `<code class="file-path">${files[name]}</code>`;
const numbered = (items) => `<ol class="numbered">${items.map((x) => `<li>${x}</li>`).join('')}</ol>`;
const promptActions = (key) => `<div class="button-row"><button class="primary" data-copy="${key}">Copier le ${key === 'proof' ? 'modèle' : 'prompt'}</button><button data-download="${key}">Télécharger en .md</button></div>`;
const slide = (title, phase, time, html, action, notes) => ({ title, phase, time, html, action, notes });

export const slides = [
  slide('Objectif personnel et premières preuves', 'Accueil · Module 01', '0–10 min', `
    <div class="hero"><p class="eyebrow">Séance 02 · Lundi 28 septembre 2026</p>
      <h1>Passer de l’intention<br>à une première preuve.</h1>
      <p class="lead">Préciser votre objectif. Utiliser l’IA. Choisir vos corrections.</p>
      <div class="outcomes"><span><b>01</b> Un objectif corrigé</span><span><b>02</b> Trois livrables définis</span><span><b>03</b> Un dossier organisé</span><span><b>04</b> Une preuve expliquée</span></div>
      <p class="byline">Prof. Abderrahman EL HISSE <span>Challenge 100 Jours · Relance Automne 2026</span></p>
    </div>`, 'Aujourd’hui, nous cadrons les trois projets. Leur réalisation se poursuit pendant le parcours.', 'Annoncer les quatre résultats. Durée proposée : 100 minutes hors installation. Le site est le support du formateur. Les candidats ne doivent pas installer Node.js ni Vite pour participer.'),
  slide('Deux axes, une même tâche', 'Accueil · Rappel de la séance 01', '0–10 min', `
    <h1>Les outils et la méthode.</h1><div class="two-columns"><section><span class="big-label">01</span><h2>Faire les gestes</h2><p>Créer un fichier, écrire,<br>enregistrer et retrouver.</p><p class="small">Démonstration dans VS Code<br>ou votre éditeur de texte.</p></section><section><span class="big-label">02</span><h2>Faire des choix</h2><p>Exprimer le besoin, contrôler,<br>corriger et garder une preuve.</p><p class="small">L’IA propose.<br>Vous décidez du contenu retenu.</p></section></div>`, 'Ouvrez votre dossier personnel avant de commencer.', 'Montrer rapidement VS Code. Demander aux candidats quel geste ils savent déjà reproduire. Git et GitHub ne conditionnent pas la pratique de cette séance.'),
  slide('Le cycle de travail LN-IA', 'Accueil · Méthode', '0–10 min', `
    <h1>Une production se contrôle.</h1><ol class="cycle"><li><b>1</b>Intention</li><li><b>2</b>Prompt</li><li><b>3</b>Production</li><li class="human"><b>4</b>Contrôle humain</li><li class="human"><b>5</b>Correction</li><li><b>6</b>Classement</li><li><b>7</b>Preuve</li></ol><p class="statement">La preuve décrit ce que vous avez<br>réellement fait et vérifié.</p>`, 'Nommez la décision que vous gardez à chaque étape.', 'Faire nommer les sept étapes. Distinguer une réponse fluide, un livrable utile et une preuve datée. La correction peut confirmer un choix déjà juste si elle est expliquée.'),
  slide('Quels fichiers avez-vous déjà ?', 'Diagnostic · Dossier de départ', '10–25 min', `
    <h1>Retrouver avant de compléter.</h1>${numbered(['Où se trouve votre dossier sur l’ordinateur ?', 'Quel fichier pouvez-vous ouvrir maintenant ?', 'Quelle production serait utile dans votre activité ?', 'Quel geste vous demande encore de l’aide ?'])}<p class="inline-status">Pour chaque fichier : <b>présent</b> · <b>à compléter</b> · <b>à créer</b></p>`, 'Ouvrez un fichier et montrez son emplacement.', 'Repérer fiche de départ, fiche identification et engagement, objectif et liste des livrables. L’Email-ID est confirmé par le canal privé indiqué par le formateur. Son absence ne bloque pas l’objectif. Un nouveau candidat crée son fichier et rejoint l’activité.'),
  slide('Un besoin devient précis', 'Atelier 1 · Exemple pédagogique fictif', '25–50 min', `
    <h1>De « mes cours » à une fiche utile.</h1><blockquote>« Je veux utiliser l’IA pour mes cours, préparer plus facilement mes exercices et mieux organiser mes fichiers. Je débute dans VS Code. »</blockquote><div class="example-lines"><p><span>Public</span>Élèves de première année scientifique</p><p><span>Production</span>Trois exercices de circuits électriques avec corrigé</p><p><span>Contrôle</span>Unités, calculs et progression des questions</p></div>`, 'Reprenez ces trois questions : pour qui, quoi produire, comment vérifier ?', 'Dire explicitement que le cas est fictif. Montrer le brouillon dans l’éditeur. Une version modifiable et un PDF sont des formats de la même fiche, pas deux projets distincts.'),
  slide('Quatre rubriques pour mon objectif', 'Atelier 1 · Rédaction personnelle', '25–50 min', `
    <h1>Écrire environ dix lignes.</h1><div class="rubrics"><p><b>01</b><span>Mon point de départ<small>Activité, expérience, difficulté principale.</small></span></p><p><b>02</b><span>Ce que je veux apprendre à produire<small>Public, besoin et production attendue.</small></span></p><p><b>03</b><span>Mes preuves attendues<small>Fichiers, contrôles et explications.</small></span></p><p><b>04</b><span>Mes trois premiers livrables<small>Trois réalisations nommées et distinctes.</small></span></p></div>`, file('objectif'), 'Le candidat écrit d’abord avec ses mots. Dix lignes est un repère de contenu et non un comptage selon la largeur de l’écran. Les détails des projets iront dans le fichier des livrables.'),
  slide('Trois livrables à définir', 'Atelier 1 · Choix des projets', '25–50 min', `
    <h1>Un usage et un contrôle par livrable.</h1><table class="slide-table"><thead><tr><th>Exemple fictif</th><th>Utilité</th><th>Premier contrôle</th></tr></thead><tbody><tr><td>Fiche d’exercices et corrigé</td><td>Faire pratiquer les élèves</td><td>Calculs et unités</td></tr><tr><td>Grille de vérification</td><td>Repérer les erreurs</td><td>Tester chaque critère</td></tr><tr><td>Guide d’utilisation</td><td>Expliquer comment travailler</td><td>Faire relire les consignes</td></tr></tbody></table><p class="small">Pour chacun, ajoutez votre date cible et votre prochaine action.</p>`, file('livrables'), 'Définir trois projets aujourd’hui, sans prétendre les avoir réalisés. Le premier doit être utile et limité. Faire choisir une date réaliste par le candidat, sans imposer une échéance absente des sources.'),
  slide('Votre temps de production', 'Atelier 1 · Travail individuel', '25–50 min', `
    <div class="writing-time"><div><p class="eyebrow">À vous de produire</p><h1>Écrivez votre<br>objectif personnel.</h1><p class="lead">Quatre rubriques.<br>Votre besoin et vos mots.<br>Un fichier enregistré.</p><p class="small">Ensuite : complétez la liste des trois livrables.</p></div><section class="timer" aria-label="Minuteur de rédaction de huit minutes"><span class="timer-label">Temps de rédaction</span><output id="timer-output" aria-label="Temps restant">08:00</output><div class="timer-controls"><button id="timer-toggle" class="primary">Démarrer</button><button id="timer-reset">Réinitialiser</button></div><p class="timer-hint" id="timer-hint">Le minuteur démarre sur votre action.</p></section></div>`, file('objectif'), 'Les huit minutes sont une phase de rédaction au sein des 25 minutes d’atelier 1. Garder ensuite huit minutes pour les livrables et cinq minutes pour relire et enregistrer. Le minuteur est manuel. Il continue si vous changez d’écran, mais se réinitialise au rechargement.'),
  slide('Un prompt adapté à mon contexte', 'Atelier 2 · Amélioration avec l’IA', '50–70 min', `
    <h1>Donner les faits et le résultat attendu.</h1><div class="prompt-summary"><p><b>Mon contexte</b> : brouillon, public, contraintes.</p><p><b>Ma demande</b> : clarifier sans changer mon intention.</p><p><b>Mes limites</b> : ne rien inventer, poser les questions utiles.</p><p><b>La sortie</b> : quatre rubriques, dix lignes environ.</p></div>${promptActions('master')}<p class="small">Le texte complet est disponible dans <a href="#ressources">Ressources et prompts</a>.</p>`, 'Personnalisez les champs dans votre outil IA, puis conservez la demande réellement utilisée.', 'Répartition proposée : 4 min pour adapter, 5 min pour lire la réponse, 6 min pour contrôler et corriger, 5 min pour enregistrer. Enlever les informations privées inutiles du brouillon. Si aucun accès IA, travailler sur la réponse illustrative de l’écran suivant.'),
  slide('Lire avant de garder', 'Atelier 2 · Contrôle humain', '50–70 min', `
    <h1>Repérer ce qui ne vient pas de vous.</h1><p class="eyebrow">Réponse illustrative préparée pour l’exercice</p><blockquote class="bad-example">« Je vais <mark>maîtriser tous les outils d’IA en une semaine</mark> et automatiser entièrement mes cours <mark>sans relecture</mark>. Je créerai immédiatement <mark>une plateforme complète</mark> pour toutes mes classes. »</blockquote><div class="inline-status"><span>Périmètre excessif</span><span>Contrôle absent</span><span>Projet ajouté</span></div>`, 'Choisissez une phrase à retirer ou à corriger. Expliquez votre décision.', 'Cette réponse a été préparée pour l’exercice. Ne pas la présenter comme un résultat réellement obtenu. Faire repérer la durée inventée, la suppression de la relecture et la plateforme absente du besoin.'),
  slide('Décider une correction précise', 'Atelier 2 · Correction et enregistrement', '50–70 min', `
    <h1>Garder le besoin, préciser le contrôle.</h1><blockquote class="good-example">« Je veux créer une fiche de trois exercices de circuits électriques avec corrigé. Je vérifierai les unités, les calculs et le niveau des questions avant de retenir la version finale. »</blockquote><p class="small">Exemple de correction humaine à adapter à votre propre projet.</p>${promptActions('correction')}<p class="decision-line">J’ai retiré une promesse. J’ai ajouté un contrôle.</p>`, 'Gardez le brouillon, le prompt utilisé et votre décision dans 02-prompts/premiers-prompts.md.', 'Montrer le prompt de correction ciblée disponible dans les ressources. Ne pas effacer la seule copie du brouillon. Placer « Brouillon initial », la réponse utile et la décision dans premiers-prompts.md. L’objectif contient la version retenue.'),
  slide('Quatre dossiers pour retrouver mon travail', 'Atelier 3 · Classement', '70–90 min', `
    <h1>Le bon contenu au bon endroit.</h1><div class="folder-list"><div><code>01-depart</code><p>Fiche de départ et objectif personnel</p></div><div><code>02-prompts</code><p>Demandes, brouillon et décisions</p></div><div><code>03-livrables</code><p>Liste des trois premiers livrables</p></div><div><code>04-portfolio-preuves</code><p>Journal daté et capture utile</p></div></div>`, 'Ouvrez le dossier, enregistrez avec Ctrl+S puis retrouvez le fichier.', '5 min de démonstration, 8 min de classement, 5 min de preuve, 2 min de réouverture. Garder les quatre dossiers de la séance 01. Si une organisation existante fonctionne, préparer une correspondance sans déplacement précipité. Les fiches nominatives restent privées.'),
  slide('Une preuve datée et expliquée', 'Atelier 3 · Portfolio', '70–90 min', `
    <h1>Décrire un contrôle réellement fait.</h1><div class="proof-lines"><p><span>Date et fichier</span>Qu’ai-je examiné ?</p><p><span>Contrôle et résultat</span>Qu’ai-je vérifié et observé ?</p><p><span>Correction</span>Quelle décision ai-je prise ?</p><p><span>Prochaine action</span>Que reste-t-il à faire et quand ?</p></div>${promptActions('proof')}`, file('preuve'), 'Le journal est rempli après l’action. Une capture ne démontre pas à elle seule la qualité du contenu. Écrire autocontrôle si aucune autre personne n’a relu. Une relecture par un pair n’est indiquée que si elle a eu lieu.'),
  slide('Retrouver puis expliquer', 'Atelier 3 · Vérification des fichiers', '70–90 min', `
    <h1>La sauvegarde se vérifie à la réouverture.</h1>${numbered(['Enregistrez votre objectif puis fermez le fichier.', 'Rouvrez-le depuis le dossier 01-depart.', 'Relisez la dernière phrase et expliquez votre correction.'])}<p class="statement compact">Le contenu retenu doit être visible<br>dans le fichier rouvert.</p>`, 'Montrez le nom du fichier, son emplacement et la phrase corrigée.', 'Le formateur vérifie un résultat observable. Si le contenu manque, regarder le fichier ouvert, le dossier et l’enregistrement. Le nom peut sembler juste mais porter une double extension .md.txt : faire vérifier si nécessaire.'),
  slide('Mon bilan en une minute', 'Bilan · Restitution', '90–100 min', `
    <h1>Montrer le résultat et le choix.</h1><div class="rubrics"><p><b>01</b><span>Mon besoin<small>Pour qui je souhaite produire.</small></span></p><p><b>02</b><span>Mon premier livrable<small>Ce que je veux rendre utilisable.</small></span></p><p><b>03</b><span>Ma correction<small>Ce que j’ai modifié et pourquoi.</small></span></p><p><b>04</b><span>Ma preuve<small>Le fichier et le contrôle que je peux expliquer.</small></span></p></div>`, 'Terminez par : « Mon prochain geste sera… »', 'Limiter les prises de parole pour préserver le temps de bilan. Regrouper les besoins d’aide en formulation, gestes fichiers, prompt ou contrôle. Choisir ensuite deux exemples anonymisés pour un retour collectif.'),
  slide('La prochaine action', 'Bilan · Poursuite du parcours', '90–100 min', `
    <h1>Conserver, partager, poursuivre.</h1>${numbered(['Finalisez l’objectif et la liste des trois livrables.', 'Complétez la preuve avec le résultat de vos contrôles.', 'Remettez les fichiers par le canal privé indiqué par le formateur.'])}<p class="next-action">Votre décision : une action précise et une date cible.</p><div class="button-row"><a class="button primary" href="#ressources">Ouvrir les supports candidats</a></div>`, 'Apprendre en produisant. Produire avec méthode. Partager avec valeur. Avancer avec conscience.', 'Annoncer oralement le canal privé de remise. Il n’est pas inventé dans ce support. Les fiches personnelles ne sont pas publiées dans le dépôt pédagogique. Faire choisir une prochaine action réaliste. Aucun envoi n’est réalisé par ce site.'),
];

const promptData = {
  master: { title: 'Prompt maître · Clarifier mon objectif', content: masterPrompt, filename: 'prompt-maitre-objectif-personnel.md' },
  correction: { title: 'Prompt de correction · Exemple fictif', content: correctionPrompt, filename: 'prompt-correction-exemple.md' },
  proof: { title: 'Modèle · Preuve de progression', content: proofTemplate, filename: 'modele-preuves-semaine-01.md' },
};
const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
let current = 0;
let notesOpen = false;
let remaining = 480;
let deadline = null;
let ticker = null;

function header() {
  return `<header class="header"><a class="brand" href="#slide/1" aria-label="LN-IA · Première diapositive"><img src="${import.meta.env.BASE_URL}logo-ln-ia.png" alt="LN-IA" /></a><div class="session-label">Challenge 100 Jours <span>Séance 02 · Module 01</span></div><nav aria-label="Outils de présentation"><a href="#ressources" class="quiet-link">Ressources</a><button id="fullscreen" class="quiet" title="Plein écran (F)">Plein écran</button></nav></header>
    <nav class="support-links" aria-label="Supports de la séance">
      <span class="support-label">Supports de la séance</span>
      <a class="support-guide" href="${import.meta.env.BASE_URL}guide.html">Ouvrir le guide interactif <span aria-hidden="true">→</span></a>
      <a href="${import.meta.env.BASE_URL}documents-candidats/guide-illustre-seance-02-module-01.pdf" download>Guide illustré <span class="support-format">PDF · 10 pages</span></a>
      <a href="${import.meta.env.BASE_URL}documents-candidats/cahier-pratique-seance-02-module-01.pdf" download>Cahier pratique <span class="support-format">PDF · À remplir</span></a>
    </nav>`;
}
function render() {
  const resources = window.location.hash === '#ressources';
  if (resources) {
    document.title = 'Ressources · Séance 02 · LN-IA';
    document.getElementById('app').innerHTML = `${header()}<main id="content" class="resources" tabindex="-1"><a class="back" href="#slide/${current + 1}">← Revenir à la présentation</a><p class="eyebrow">À conserver pour la pratique</p><h1>Ressources de la séance 02</h1><p class="lead">Lundi 28 septembre 2026 · Objectif personnel, livrables et autonomie numérique.</p><section class="resource-section"><h2>Supports candidats</h2><div class="download-links"><a href="${import.meta.env.BASE_URL}documents-candidats/guide-presentation-seance-02-module-01.docx" download>Guide de présentation de la séance 02 <span>Word · Télécharger</span></a><a href="${import.meta.env.BASE_URL}documents-candidats/fiche-candidat-seance-02-module-01.docx" download>Fiche candidat à remplir <span>Word · Télécharger</span></a></div><p>Conservez la fiche nominative dans votre espace personnel. Le formateur indique le canal privé de remise. Ce site ne recueille aucune réponse.</p></section><section class="resource-section"><h2>Déroulé prévisionnel · 100 minutes</h2><table class="resource-table"><thead><tr><th>Temps</th><th>Travail</th><th>Résultat attendu</th></tr></thead><tbody><tr><td>0–10 min</td><td>Accueil et rappel</td><td>Comprendre les quatre sorties</td></tr><tr><td>10–25 min</td><td>Diagnostic des fichiers</td><td>Repérer ce qui reste à compléter</td></tr><tr><td>25–50 min</td><td>Atelier 1 · Écrire</td><td>Objectif et trois livrables définis</td></tr><tr><td>50–70 min</td><td>Atelier 2 · Améliorer</td><td>Texte corrigé et prompt conservé</td></tr><tr><td>70–90 min</td><td>Atelier 3 · Organiser</td><td>Fichiers retrouvés et preuve datée</td></tr><tr><td>90–100 min</td><td>Bilan</td><td>Expliquer la prochaine action</td></tr></tbody></table></section><section class="resource-section"><h2>Prompts et modèle à copier</h2><p>Remplacez les champs entre crochets dans votre outil de travail. Le prompt de correction concerne l’exemple fictif du guide. Adaptez-le si votre projet est différent.</p>${Object.entries(promptData).map(([key, data]) => `<article class="prompt-resource"><h3>${data.title}</h3>${promptActions(key)}<pre tabindex="0">${escapeHtml(data.content)}</pre></article>`).join('')}</section><section class="resource-section"><h2>Référence et commandes</h2><p>Support établi à partir du guide de la séance 02 du Module 01, édition du 28 septembre 2026, Prof. Abderrahman EL HISSE.</p><p><a href="https://elhisse-clprepas.github.io/atelier-seance-01_25_SEPTEMBRE_2026/" target="_blank" rel="noopener noreferrer">Revoir le site pédagogique de la séance 01 ↗</a></p><p><kbd>←</kbd> <kbd>→</kbd> Changer d’écran · <kbd>Home</kbd> Début · <kbd>End</kbd> Fin · <kbd>F</kbd> Plein écran</p><p>Les notes du formateur s’affichent à la demande. Partagez la fenêtre de présentation dans Zoom. Le minuteur s’utilise sur l’écran 08.</p><a class="button primary" href="#slide/${current + 1}">Revenir à l’écran ${String(current + 1).padStart(2, '0')}</a></section></main><footer class="resource-footer">LN-IA · Prof. Abderrahman EL HISSE · 28 septembre 2026</footer>`;
    document.querySelector('.download-links').insertAdjacentHTML('afterbegin', `
      <a href="${import.meta.env.BASE_URL}guide.html">Guide interactif illustré <span>Huit chapitres · Parcourir et pratiquer</span></a>
      <a href="${import.meta.env.BASE_URL}documents-candidats/guide-illustre-seance-02-module-01.pdf" download>Guide illustré de la séance 02 <span>PDF · Sommaire cliquable et signets</span></a>
      <a href="${import.meta.env.BASE_URL}documents-candidats/cahier-pratique-seance-02-module-01.pdf" download>Cahier pratique à remplir <span>PDF · Huit pages et champs interactifs</span></a>`);
  } else {
    const match = /^#slide\/(\d+)$/.exec(window.location.hash);
    if (match) current = Math.min(slides.length - 1, Math.max(0, Number(match[1]) - 1));
    const selected = slides[current];
    document.title = `${String(current + 1).padStart(2, '0')} · ${selected.title} · LN-IA`;
    document.getElementById('app').innerHTML = `${header()}<main id="content" class="slide-shell" tabindex="-1" aria-label="Écran ${current + 1} sur ${slides.length} : ${selected.title}"><div class="phase"><span>${selected.phase}</span><span>${selected.time}</span></div><article class="slide slide-${current + 1}">${selected.html}</article><div class="action"><span>À faire</span><div>${selected.action}</div></div>${notesOpen ? `<aside class="trainer-notes" aria-label="Notes du formateur"><b>Notes du formateur</b><p>${selected.notes}</p></aside>` : ''}</main><footer class="controls"><div class="move-controls"><button id="previous" aria-label="Écran précédent" ${current === 0 ? 'disabled' : ''}>←</button><label for="slide-select" class="sr-only">Choisir un écran</label><select id="slide-select">${slides.map((item, index) => `<option value="${index}" ${index === current ? 'selected' : ''}>${String(index + 1).padStart(2, '0')} · ${item.title}</option>`).join('')}</select><button id="next" aria-label="Écran suivant" ${current === slides.length - 1 ? 'disabled' : ''}>→</button></div><div class="footer-right"><button id="notes-toggle" class="quiet" aria-expanded="${notesOpen}">${notesOpen ? 'Masquer les notes' : 'Notes formateur'}</button><span class="slide-count" aria-label="Écran ${current + 1} sur ${slides.length}">${String(current + 1).padStart(2, '0')} <small>/ ${slides.length}</small></span></div></footer><div class="progress" aria-hidden="true" style="width:${((current + 1) / slides.length) * 100}%"></div>`;
    document.getElementById('previous').addEventListener('click', () => go(current - 1));
    document.getElementById('next').addEventListener('click', () => go(current + 1));
    document.getElementById('slide-select').addEventListener('change', (e) => go(Number(e.target.value)));
    document.getElementById('notes-toggle').addEventListener('click', () => { notesOpen = !notesOpen; render(); document.getElementById('notes-toggle').focus(); });
    document.getElementById('timer-toggle')?.addEventListener('click', toggleTimer);
    document.getElementById('timer-reset')?.addEventListener('click', resetTimer);
    updateTimerDisplay();
  }
  document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
  document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', () => copyPrompt(button.dataset.copy, button)));
  document.querySelectorAll('[data-download]').forEach((button) => button.addEventListener('click', () => downloadPrompt(button.dataset.download)));
}
function go(index) {
  const next = Math.min(slides.length - 1, Math.max(0, index));
  if (next !== current || window.location.hash === '#ressources') {
    current = next;
    window.location.hash = `slide/${next + 1}`;
  }
}
function announce(message) { document.getElementById('status').textContent = message; }
async function copyPrompt(key, button) {
  try {
    await navigator.clipboard.writeText(promptData[key].content);
    button.textContent = 'Copié';
    announce('Texte copié. Personnalisez-le dans votre outil de travail.');
  } catch {
    const area = document.createElement('textarea');
    area.value = promptData[key].content;
    area.className = 'clipboard-fallback';
    document.body.append(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    area.remove();
    button.textContent = ok ? 'Copié' : 'Copie indisponible';
    announce(ok ? 'Texte copié.' : 'Utilisez Télécharger en .md pour conserver le texte.');
    button.focus();
  }
}
function downloadPrompt(key) {
  const data = promptData[key];
  const url = URL.createObjectURL(new Blob([data.content + '\n'], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = data.filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('Téléchargement du texte demandé.');
}
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else announce('Le plein écran n’est pas disponible dans ce navigateur. Utilisez sa commande de plein écran.');
  } catch { announce('Le navigateur a refusé le plein écran. Utilisez sa commande de plein écran.'); }
}
function updateTimerDisplay() {
  const output = document.getElementById('timer-output');
  if (!output) return;
  const seconds = deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : remaining;
  output.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  document.getElementById('timer-toggle').textContent = deadline ? 'Pause' : (remaining === 480 ? 'Démarrer' : 'Reprendre');
  document.getElementById('timer-toggle').disabled = seconds === 0;
  document.getElementById('timer-hint').textContent = seconds === 0 ? 'Temps écoulé. Enregistrez votre fichier.' : deadline ? 'Temps de rédaction en cours.' : remaining === 480 ? 'Le minuteur démarre sur votre action.' : 'Minuteur en pause.';
}
function toggleTimer() {
  if (deadline) {
    remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    deadline = null;
    clearInterval(ticker);
    ticker = null;
  } else if (remaining > 0) {
    deadline = Date.now() + remaining * 1000;
    ticker = setInterval(() => {
      if (Date.now() >= deadline) {
        remaining = 0;
        deadline = null;
        clearInterval(ticker);
        ticker = null;
        announce('Les huit minutes sont écoulées. Enregistrez votre fichier.');
      }
      updateTimerDisplay();
    }, 250);
  }
  updateTimerDisplay();
}
function resetTimer() { clearInterval(ticker); ticker = null; deadline = null; remaining = 480; updateTimerDisplay(); announce('Minuteur réinitialisé à huit minutes.'); }
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  const content = document.getElementById('content');
  content.focus({ preventScroll: true });
  content.scrollIntoView({ block: 'start' });
});
window.addEventListener('hashchange', () => { render(); document.getElementById('content').focus({ preventScroll: true }); window.scrollTo(0, 0); });
window.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); return; }
  if (window.location.hash === '#ressources') return;
  const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
  if (event.key in targets) { event.preventDefault(); go(targets[event.key]); }
});
if (!window.location.hash) history.replaceState(null, '', '#slide/1');
render();
