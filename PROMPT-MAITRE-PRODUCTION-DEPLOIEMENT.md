# Prompt maître pour Codex

Copier le texte de la section suivante dans Codex après avoir ouvert le dossier de ce pack dans VS Code. Il pilote la préparation, l’exécution locale et la publication. Les étapes de publication modifient le dépôt GitHub indiqué.

## Mission à exécuter

Tu es mon assistant de production pédagogique et de développement web pour LAB-NUMÉRIQUE-IA. Je suis Prof. Abderrahman EL HISSE. Je te confie la présentation de la séance 02 du Module 01, prévue le lundi 28 septembre 2026, et sa publication dans mon espace GitHub.

Travaille dans le dossier de ce pack. Commence par lire README.md, les éventuels AGENTS.md applicables, docs/ANIMATION-ZOOM.md, docs/SOURCES.md et le contenu existant de src/. Lis le guide source sources/guide-seance-02-module-01-reference.docx et les deux Word candidats dans public/documents-candidats/. Inspecte le logo avant toute modification. Si un fichier manque, signale le chemin exact et continue les étapes indépendantes.

Le pack contient déjà une version fonctionnelle. Inspecte et complète ce qui est nécessaire avant de remplacer du code existant. Conserve les modifications locales de l’utilisateur. Ne repars pas de zéro sans raison.

### Résultat attendu

Une présentation web Vite en français, lisible en partage d’écran Zoom, avec 16 écrans, navigation au clavier, plein écran, accès aux ressources, prompts copiables et téléchargeables, ainsi qu’un minuteur de travail. Les notes formateur restent masquées par défaut. Le texte est éditable dans les sources. La page ne collecte aucune information personnelle et n’envoie pas les prompts à une API.

Conserver les deux documents Word : le guide candidats de dix pages maximum et la fiche individuelle de deux pages maximum. La fiche comporte exactement trois sections : informations personnelles, informations professionnelles, engagement et prise de décision avec signature. Les fichiers distribués restent vierges.

### Références et identité

- Date : 28 septembre 2026. Ne pas inventer d’heure de début.
- Auteur : Prof. Abderrahman EL HISSE, professeur agrégé de physique, formateur et coach.
- Identité : LN-IA uniquement, logo public/logo-ln-ia.png utilisé sans déformation.
- Couleurs : blanc ou ivoire, bleu marine, accent or provenant du logo.
- Durée proposée : 100 minutes, accueil 10, diagnostic 15, atelier 1 de 25, atelier 2 de 20, atelier 3 de 20, bilan 10.
- Méthode : intention, prompt, production, contrôle humain, correction, classement, preuve.
- Les trois livrables sont définis aujourd’hui. Ils ne sont pas trois projets entièrement réalisés pendant les 100 minutes.
- L’exemple de l’enseignant et la réponse IA problématique sont fictifs et identifiés comme tels.

### Contenu des 16 écrans

1. Séance 02 et résultats attendus.
2. Les deux axes de la séance 01 : outils et méthode.
3. Le cycle de travail et la décision humaine.
4. Le diagnostic des fichiers de départ.
5. Un besoin précis à partir de l’exemple de l’enseignant.
6. L’objectif en quatre rubriques : point de départ, production visée, preuves, trois livrables.
7. Les trois projets avec utilité, date cible et contrôle.
8. Un temps de rédaction individuelle avec minuteur de huit minutes.
9. Le prompt adapté au contexte.
10. L’examen critique d’une réponse illustrative.
11. Une correction ciblée et la version retenue.
12. Les quatre dossiers et les fichiers à conserver.
13. Une preuve datée avec contrôle et résultat observé.
14. La fermeture puis la réouverture du fichier pour vérifier sa sauvegarde.
15. Le bilan du candidat en une minute.
16. La prochaine action et la remise des travaux.

Conserver exactement l’arborescence pédagogique : 01-depart, 02-prompts, 03-livrables, 04-portfolio-preuves. Les fichiers sont fiche-depart-candidat.md, objectif-personnel-challenge.md, premiers-prompts.md, liste-premiers-livrables.md et preuves-semaine-01.md. Garder les fiches nominatives remplies hors du dépôt public.

### Travail local

1. Examiner l’état du dossier et de Git. Ne pas écraser une branche ou des fichiers non suivis existants.
2. Vérifier Node.js. Préférer Node.js 24 et respecter les versions de package.json et package-lock.json.
3. Exécuter npm ci, npm run build et npm run check. Corriger les erreurs réelles. Ne pas présenter une commande prévue comme une commande réussie.
   Sous PowerShell Windows, utiliser npm.cmd si npm.ps1 est bloqué, sans modifier la politique d’exécution. Un clone ou ZIP des sources GitHub nécessite cette compilation avant le premier démarrage, car dist est exclu du dépôt.
4. Lancer npm run dev. Vérifier l’adresse http://127.0.0.1:5173/ et annoncer le port effectivement utilisé.
5. Parcourir les 16 écrans. Tester gauche, droite, Home, End, F, l’index, les ressources, le minuteur et les boutons copier et télécharger. Vérifier les liens des deux Word.
6. Inspecter l’affichage sur un écran de projection et sur mobile. Corriger les débordements. Vérifier que les champs personnels ne sont pas envoyés sur Internet.
7. Construire à nouveau si nécessaire. Tester la version dist avec node scripts/serve-dist.mjs, y compris sous le chemin /Atelier-seance-02-28-Septembre-2026/. Vérifier un lien direct #slide/9 puis un rechargement.
   Pour simuler ce chemin : node scripts/serve-dist.mjs --prefix=/Atelier-seance-02-28-Septembre-2026/. Ouvrir http://127.0.0.1:4173/Atelier-seance-02-28-Septembre-2026/#slide/9 après avoir libéré le port 4173.

### Publication GitHub autorisée par cette mission

Compte attendu : elhisse-CLPrepas.
Nom technique du dépôt : Atelier-seance-02-28-Septembre-2026.
Titre public : Atelier séance 02 du 28 septembre 2026.

Vérifier le compte connecté avec les outils disponibles sans afficher de jeton. Rechercher le dépôt exact et lire son état avant toute écriture. Si le dépôt existe, préserver son contenu, lire ses instructions, travailler sur une branche dédiée et ouvrir une Pull Request. Respecter les protections existantes et les droits réellement disponibles. Ne pas pousser de force, réécrire l’historique, supprimer un dépôt ni contourner une règle de protection.

Si le dépôt n’existe pas, cette mission autorise sa création publique sous le compte indiqué, avec les fichiers sources du pack et une branche main. Vérifier que les éléments à publier sont uniquement les supports pédagogiques et les modèles vierges. Ne pas publier node_modules, dossiers de candidats, secrets, fichiers .env, caches ou traces locales. Respecter .gitignore.

Configurer GitHub Pages avec la source GitHub Actions. Utiliser le workflow .github/workflows/deploy-pages.yml qui installe les dépendances, construit, contrôle et publie dist. Si le dépôt existant emploie une autre branche par défaut, adapter les déclencheurs de manière cohérente plutôt que renommer la branche. Ne modifier ni nom de domaine ni réglage sans lien avec cette mission.

Après les contrôles locaux et la préparation du commit, pousser la branche ou le nouveau dépôt. Pour une PR, vérifier les contrôles et les règles de fusion. Si les droits et règles autorisent la fusion dans le cadre de cette mission, fusionner puis suivre le déploiement. Sinon, laisser la PR prête et indiquer précisément l’intervention requise.

Avant chaque commit de publication, lire git diff --cached --name-only et exécuter npm run check -- --staged. Ce contrôle des chemins de l’index Git complète la lecture humaine des documents et la vérification qu’ils sont vierges.

Vérifier l’URL renvoyée par le déploiement, normalement https://elhisse-clprepas.github.io/Atelier-seance-02-28-Septembre-2026/. Ouvrir l’accueil, un écran direct, les prompts et les deux téléchargements. Une compilation réussie seule ne prouve pas la disponibilité publique. Si un accès ou une approbation bloque une étape, donner l’état exact sans annoncer la publication comme terminée.

### Rapport final demandé

Indiquer les fichiers modifiés, les commandes réellement exécutées et leur résultat, l’adresse locale, le dépôt et le commit ou la PR, l’état du workflow et l’URL publique effectivement vérifiée. Distinguer les étapes terminées de celles qui demandent encore une action. Fournir une consigne courte pour présenter la séance sur Zoom.

Attribuer à chaque contrôle le statut réussi, échoué ou non vérifié. Un contrôle automatique réussi ne suffit pas à valider l’affichage, les interactions ou la pagination Word.
