# Contrôle du pack — 28 septembre 2026

Version 1.0. Contrôles effectués sur le pack livré.

- Présentation : 16 écrans, parcourus et inspectés visuellement à 1366 × 768 ; aucun débordement de la page.
- Mobile : affichage contrôlé à 390 pixels de largeur, sans débordement horizontal sur les écrans testés et les ressources.
- Interactions : navigation au clavier, menu des écrans, rechargement d’un écran direct, notes, plein écran, minuteur, copie et téléchargement du prompt vérifiés dans Chromium.
- Documents : guide candidats de 8 pages et fiche vierge de 2 pages ; chaque page du rendu Word a été inspectée. La fiche comporte les trois sections demandées, avec signature.
- Cohérence : durée prévisionnelle de 100 minutes, quatre dossiers et cinq fichiers modèles conformes au guide source. Les trois livrables sont définis pendant la séance, puis réalisés au cours du parcours.
- Logo : image fournie conservée et utilisée sans déformation.
- Construction : npm run build et npm run check exécutés avec succès.
- Distribution : les deux liens Word répondent en local et sous le chemin simulé /Atelier-seance-02-28-Septembre-2026/. Les copies distribuées correspondent aux documents livrés.
- Publication : workflow et procédure fournis. Aucun déploiement public n’a été exécuté dans le cadre de la préparation de ce ZIP.

Le fichier README.md indique comment présenter la version déjà construite et comment modifier les sources. Le prompt maître décrit l’exécution de la publication et les vérifications à effectuer sur l’URL publique.

## Vérification après correction de l’audit

Le 28 septembre 2026, les consignes Windows et de compilation depuis les sources GitHub ont été précisées. Le lien « Aller au contenu » conserve désormais la page courante. Les cinq modèles, les chemins de fichiers sensibles dans public/dist et les chemins de l’index Git sont contrôlés. Le modèle des trois livrables contient un champ de premier contrôle pour chaque projet.

- Réussi : installation, compilation, contrôle du pack et 11 tests des contrôles de publication.
- Réussi : réponses HTTP de l’accueil et des deux documents Word sur le serveur Vite, la version compilée et le sous-chemin simulé du dépôt.
- Réussi : lecture du guide source, des deux Word candidats et inspection du logo. Les fichiers candidats restent vierges.
- Non vérifié dans cette nouvelle passe : affichage et interactions dans un navigateur, pagination et rendu visuel Word. Les outils de contrôle du navigateur et des applications Windows n’étaient pas connectés au moment de cette vérification.

Les contrôles visuels de la section initiale décrivent la préparation du pack. Ils ne constituent pas une nouvelle validation après les corrections. Le contrôle automatique des noms de fichiers complète la lecture humaine des documents ; il ne détecte pas à lui seul toutes les données personnelles.
