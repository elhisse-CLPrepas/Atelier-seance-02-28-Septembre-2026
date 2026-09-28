# Publication sur GitHub Pages

La publication est préparée dans ce pack. Elle doit être exécutée depuis le compte autorisé et vérifiée après le déploiement.

## Noms et destination

- Compte prévu : `elhisse-CLPrepas`.
- Dépôt technique : `Atelier-seance-02-28-Septembre-2026`.
- Adresse cible : `https://elhisse-clprepas.github.io/Atelier-seance-02-28-Septembre-2026/`.
- Le nom technique évite l’accent dans les chemins. Le titre affiché reste en français.

## Préparer le dépôt

Lire le prompt maître avant de confier la publication à Codex. Vérifier le compte connecté et rechercher le dépôt exact. Pour un dépôt existant, conserver ses instructions et ses fichiers, créer une branche de travail et faire relire la PR selon ses règles. Pour un nouveau dépôt, placer le contenu du dossier de projet à sa racine. `package.json` et `.github/` doivent être au même niveau, sans dossier intermédiaire superflu.

Les modèles candidats sont vierges. Aucune fiche remplie ne doit figurer dans le commit. `dist` est fourni dans le ZIP pour la présentation locale mais le workflow le reconstruit. `.gitignore` l’exclut du dépôt.

## Contrôles locaux

```bash
npm ci
npm run build
npm run check
npm run preview
```

Sous PowerShell Windows, utiliser `npm.cmd` à la place de `npm` si l’exécution de `npm.ps1` est bloquée. Un clone ou ZIP des sources GitHub ne contient pas `dist` : les étapes d’installation et de compilation sont nécessaires avant le premier démarrage local.

Après préparation du commit, lire la liste `git diff --cached --name-only`, vérifier que les documents candidats sont vierges, puis exécuter `npm run check -- --staged`. Ce contrôle porte sur tous les chemins de l’index Git, y compris les fichiers déjà suivis. Il rejette notamment les dossiers privés, les fichiers `.env` et leurs variantes, les clés privées et les répertoires de travail local.

Pour simuler le chemin GitHub Pages, arrêter l’aperçu puis lancer :

```bash
node scripts/serve-dist.mjs --prefix=/Atelier-seance-02-28-Septembre-2026/
```

Tester `http://127.0.0.1:4173/Atelier-seance-02-28-Septembre-2026/#slide/9` et les deux téléchargements Word.

Contrôler les écrans et les téléchargements sur `http://127.0.0.1:4173/`. Le routage utilise des ancres, donc un lien vers `#slide/9` n’exige pas de réécriture serveur. Les chemins de ressources sont relatifs à la page.

## Configurer Pages

Dans le dépôt GitHub, ouvrir Settings puis Pages. Sous Build and deployment, choisir GitHub Actions comme source. Le workflow `Séance 02 LN-IA · GitHub Pages` est fourni dans `.github/workflows/deploy-pages.yml`.

Le workflow :

1. Exécute `npm ci` avec Node.js 24.
2. Lance `npm run build` puis `npm run check`.
3. Sur `main` uniquement, prépare Pages et envoie le contenu de `dist`.
4. Déploie l’artefact dans l’environnement `github-pages`.

Une Pull Request effectue les deux premières étapes sans publication. Un déclenchement manuel est disponible depuis Actions. Si une règle d’environnement impose une intervention humaine, la respecter. Le workflow ne nécessite pas de jeton personnel à stocker dans le dépôt.

## Vérifier après le déploiement

Attendre la réussite du job de déploiement. Utiliser son URL, puis vérifier : accueil, navigation, lien direct vers un écran, logo, prompts et deux fichiers Word. Confirmer l’accès depuis une fenêtre non connectée. Relever la date, le commit et le résultat dans le suivi du projet.

En cas d’échec, lire le premier message d’erreur du job concerné. Vérifier notamment la source Pages, la branche autorisée, les permissions du workflow, le fichier de verrouillage npm et les noms des documents. Ne pas annoncer une publication réussie sur la seule base du build local.

Références : [Vite](https://vite.dev/guide/static-deploy), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
