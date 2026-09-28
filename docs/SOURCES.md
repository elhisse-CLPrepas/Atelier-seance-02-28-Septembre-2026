# Sources du pack

## Pédagogie

- `sources/guide-seance-02-module-01-reference.docx`, guide source de 24 pages fourni par l’auteur le 28 septembre 2026.
- [Dépôt de la séance 01](https://github.com/elhisse-CLPrepas/atelier-seance-01_25_SEPTEMBRE_2026).
- [Site de la séance 01](https://elhisse-clprepas.github.io/atelier-seance-01_25_SEPTEMBRE_2026/).
- Logo LN-IA fourni par l’auteur, conservé dans `public/logo-ln-ia.png` sans redessin.

Le guide source fonde les 16 écrans, les trois ateliers et le déroulé proposé de 100 minutes. Les exemples de l’enseignant et de la réponse IA sont des cas pédagogiques fictifs. Les résultats de production n’y sont pas présentés comme déjà réalisés par les candidats.

## Technique

Références consultées le 28 septembre 2026 :

- [Construction Vite et base relative](https://vite.dev/guide/build#relative-base).
- [Déploiement statique Vite](https://vite.dev/guide/static-deploy).
- [Workflow Pages fourni par Vite](https://github.com/vitejs/vite/blob/main/docs/guide/static-deploy-github-pages.yaml).
- [Workflows GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Les versions des actions du workflow reprennent les références épinglées du modèle Vite consulté. Le workflow sépare la vérification des PR et la publication depuis main. La base relative permet de tester le même build à la racine et sous le chemin du dépôt.
