# Atelier séance 02 du 28 septembre 2026

Présentation LN-IA pour une rencontre Zoom. Module 01 : cadrage et prise de conscience. Auteur : Prof. Abderrahman EL HISSE. Version 1.0, préparée le 28 septembre 2026.

Le pack comprend une présentation web de 16 écrans, les sources Vite, une version compilée, un support Word candidats, une fiche Word vierge en trois sections et le prompt de production et de publication. Le déroulé proposé dure 100 minutes. Les candidats définissent trois livrables puis réalisent un premier objectif corrigé et une preuve de travail.

## Démarrer pour présenter sur Zoom

1. Extraire le ZIP dans un dossier normal, hors de l’archive.
2. Installer Node.js 24 si Node.js n’est pas déjà disponible.
3. Sous Windows, ouvrir `DEMARRER-PRESENTATION.cmd`.
4. Ouvrir l’adresse affichée, normalement `http://127.0.0.1:4173/`.
5. Dans Zoom, partager la fenêtre contenant la présentation. Passer en plein écran avec le bouton de la présentation ou la touche F.

Ce démarrage utilise le dossier `dist` déjà construit. Il ne nécessite pas de télécharger les dépendances. Garder la fenêtre du serveur ouverte. Arrêter avec Ctrl+C après la séance. `docs/ANIMATION-ZOOM.md` détaille les commandes et le déroulé.

Cette procédure concerne le pack fourni avec `dist`. Un clone Git ou le ZIP des sources téléchargé depuis GitHub ne contient pas `dist`, qui est exclu du dépôt. Dans ce cas, exécuter d’abord `npm ci` puis `npm run build` dans le dossier du projet, avant d’ouvrir le lanceur. Cette première installation demande une connexion.

**Sous PowerShell Windows :** si `npm` est bloqué à cause de `npm.ps1`, utiliser `npm.cmd` dans toutes les commandes, par exemple `npm.cmd ci`, `npm.cmd run build`, `npm.cmd run check` et `npm.cmd run dev`. Il n’est pas nécessaire de modifier la politique d’exécution PowerShell.

Sur macOS ou Linux, depuis le dossier du projet :

```bash
node scripts/serve-dist.mjs --open
```

## Modifier la présentation avec Vite

Depuis le terminal ouvert dans le dossier contenant `package.json` :

```bash
npm ci
npm run dev
```

Ouvrir `http://127.0.0.1:5173/`. L’installation initiale demande une connexion. Le contenu des écrans est dans `src/`. Le logo fourni est conservé dans `public/logo-ln-ia.png`.

Après modification :

```bash
npm run build
npm run check
npm run preview
```

Ouvrir `http://127.0.0.1:4173/`. Fermer le serveur déjà lancé sur ce port avant d’utiliser l’aperçu Vite. Un port occupé provoque une erreur explicite, sans changer silencieusement l’adresse.

`npm run check` vérifie aussi les cinq modèles Markdown et les noms de fichiers sensibles dans `public` et `dist`. Avant un commit de publication, examiner `git diff --cached --name-only` puis lancer `npm run check -- --staged` pour contrôler tous les chemins de l’index Git. Ces contrôles ne remplacent pas la lecture des documents pour s’assurer qu’ils sont vierges.

## Documents candidats

### Guide interactif et PDF

Ouvrir [le guide interactif](guide.html) dans le site lancé avec Vite ou le serveur local. Il propose huit chapitres, une recherche, des prompts copiables, un minuteur et des brouillons exportables. Les deux PDF sont accessibles depuis sa rubrique « Téléchargements » et depuis les ressources de la présentation.

- [Guide illustré — 10 pages](public/documents-candidats/guide-illustre-seance-02-module-01.pdf) : sommaire cliquable, signets, méthode et exemples.
- [Cahier pratique — 8 pages](public/documents-candidats/cahier-pratique-seance-02-module-01.pdf) : 54 champs remplissables, exercices et bilan.

Ces supports sont adaptés du guide Word candidats ci-dessous. Pour produire un HTML autonome, exécuter `npm run build:standalone`, puis ouvrir `output/html/guide-seance-02-autonome.html`. Pour conserver ses liens PDF hors ligne, garder le dossier `output/pdf` à côté du dossier `output/html`. La commande `npm run build:pdf` génère ces PDF après installation des dépendances Python indiquées dans [le guide de maintenance](docs/GUIDE-INTERACTIF.md).

Les brouillons du guide HTML restent en mémoire jusqu'au rechargement ou à la fermeture de la page. Utiliser les boutons d'export pour les conserver.

- `public/documents-candidats/guide-presentation-seance-02-module-01.docx` : support court de la séance.
- `public/documents-candidats/fiche-candidat-seance-02-module-01.docx` : modèle vierge, sections personnelle, professionnelle et engagement avec signature.
- `modeles-candidat/` : cinq fichiers Markdown vierges à copier dans le dossier individuel.
- `sources/guide-seance-02-module-01-reference.docx` : guide source de 24 pages réservé à la préparation.

Seuls les modèles vierges sont distribués sur le site. Le candidat conserve et remet sa fiche remplie par le canal individuel convenu avec le formateur. Les dossiers `candidats`, `reponses` et `prive` sont exclus du suivi Git. Les documents remplis ne doivent pas être ajoutés ailleurs dans ce dépôt public.

## Publication préparée

Nom technique prévu pour GitHub : `Atelier-seance-02-28-Septembre-2026`, sans accent pour conserver un nom portable. Le titre visible reste « Atelier séance 02 du 28 septembre 2026 ».

Compte prévu : `elhisse-CLPrepas`.

Adresse cible après publication réussie :

`https://elhisse-clprepas.github.io/Atelier-seance-02-28-Septembre-2026/`

Le pack ne prouve pas que cette adresse est déjà publiée. Ouvrir `PROMPT-MAITRE-PRODUCTION-DEPLOIEMENT.md` dans VS Code et en transmettre le contenu à Codex pour préparer ou mettre à jour le dépôt puis effectuer les vérifications. Le workflow `.github/workflows/deploy-pages.yml` construit le site et publie uniquement `dist` depuis `main`. Sur une Pull Request, il vérifie le build sans publication.

La base Vite relative `./` et les ancres `#slide/1` évitent les dépendances à un chemin serveur particulier. Les ressources et les documents restent utilisables sous le chemin d’un dépôt GitHub Pages. `docs/PUBLICATION-GITHUB-PAGES.md` donne la procédure et les points de contrôle.

## Repères pédagogiques

- Séance 01 : vendredi 25 septembre 2026.
- Séance 02 : lundi 28 septembre 2026. L’horaire est communiqué par le formateur.
- Méthode : intention, prompt, production, contrôle humain, correction, classement, preuve.
- Dossiers : `01-depart`, `02-prompts`, `03-livrables`, `04-portfolio-preuves`.
- Résultats : objectif corrigé, liste de trois livrables, fichiers classés et preuve datée.

Sources pédagogiques et techniques : `docs/SOURCES.md`.
