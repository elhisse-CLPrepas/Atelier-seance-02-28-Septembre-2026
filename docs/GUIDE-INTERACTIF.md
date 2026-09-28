# Guide interactif et supports PDF

## Source et livrables

Le contenu est adapté de `public/documents-candidats/guide-presentation-seance-02-module-01.docx`. Le Word est conservé. Les huit chapitres et les blocs pédagogiques sont définis dans `src/guide-data.json`, partagé par le générateur PDF et la page web.

| Support | Contenu | Emplacement généré |
| --- | --- | --- |
| Guide illustré | 10 pages, sommaire cliquable, 9 signets | `output/pdf/guide-illustre-seance-02-module-01.pdf` |
| Cahier pratique | 8 pages, 54 champs vierges ou « Non vérifié », 8 signets | `output/pdf/cahier-pratique-seance-02-module-01.pdf` |
| Guide web | 8 chapitres, recherche, méthode interactive, prompts, minuteur, brouillons et bilan exportables | `dist/guide.html` avec ses ressources |
| HTML autonome | Même guide, styles, script et logo incorporés | `output/html/guide-seance-02-autonome.html` |

La navigation PDF repose sur des liens internes et des signets. Vite construit le guide web. La compilation web utilise deux entrées, `index.html` pour la présentation et `guide.html` pour le guide ; les chemins relatifs conviennent au sous-dossier GitHub Pages. Voir la [documentation Vite sur la compilation](https://vite.dev/guide/build) et ses [options](https://vite.dev/config/build-options).

## Reconstruire

Pour le site et ses tests :

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run check
npm.cmd test
```

Pour les PDF, avec Python et les dépendances installées :

```powershell
python -m pip install -r scripts/requirements-pdf.txt
npm.cmd run build:pdf
```

Le script emploie Arial sous Windows, ou DejaVu Sans si disponible sous Linux. Il produit les PDF dans `output/pdf`, les copie dans `public/documents-candidats`, vérifie leurs pages, signets et champs, puis rend leurs pages dans `qa/pdf-guide` pour inspection. Son rapport est `qa/pdf-guide/validation.json`. Relancer `npm.cmd run build` après une modification des PDF pour actualiser `dist`.

Pour le HTML autonome :

```powershell
npm.cmd run build:standalone
```

La compilation Vite incorpore le JavaScript, les styles et le logo dans un seul HTML. Ouvrir `output/html/guide-seance-02-autonome.html` par double-clic. Conserver l'arborescence suivante pour les téléchargements locaux :

```text
output/
  html/guide-seance-02-autonome.html
  pdf/guide-illustre-seance-02-module-01.pdf
  pdf/cahier-pratique-seance-02-module-01.pdf
```

Les liens vers les sources externes et la présentation publiée demandent une connexion. Le bouton de téléchargement Markdown reste disponible si le navigateur refuse la copie dans le presse-papiers.

## Données saisies

Les brouillons et statuts du guide HTML restent en mémoire dans la page. Ils ne sont ni transmis à un serveur ni conservés après rechargement. Les boutons d'export créent des fichiers Markdown sur l'appareil. Le cahier PDF ne comporte aucun bouton d'envoi ; enregistrer une copie personnelle après saisie et la rouvrir pour vérifier les réponses dans le lecteur PDF utilisé.

## Contrôles réalisés le 28 septembre 2026

- Compilation du site et de l'HTML autonome : réussie.
- Contrôle du pack et des copies des documents : réussi.
- 20 tests Node, dont 9 tests du guide dans un DOM simulé : réussis. Ils couvrent les chapitres, ancres, recherche, méthode, exports, minuteur, menu et conservation des brouillons pendant la navigation.
- PDF : 10 et 8 pages, signets et liens contrôlés, 54 champs du cahier initialisés sans réponses personnelles ; les 18 pages rendues ont été inspectées visuellement.
- Affichage web dans un navigateur réel, sur mobile et en projection : non vérifié, car aucun navigateur connecté n'était disponible. Les tests du DOM simulé ne valident pas le rendu visuel du navigateur.

Les dossiers `output` et `qa` restent hors Git. Les deux PDF vierges distribués sont suivis dans `public/documents-candidats`.
