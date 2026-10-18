# Travailler sur une modification

Une tâche correspond à un objectif précis : correction, fonctionnalité ou rangement.
La branche `main` conserve la version relue et validée du projet.

## Cycle de travail

1. Partir de `main` à jour et créer une branche dédiée.
2. Faire les modifications liées à l’objectif, avec les tests utiles.
3. Exécuter le lint, les tests et le build.
4. Contrôler les pages concernées dans le navigateur sur mobile et desktop.
5. Créer un commit qui décrit le changement et pousser la branche.
6. Ouvrir une pull request vers `main` ; décrire le résultat et les vérifications.
7. Relire les différences et attendre la réussite de GitHub Actions.
8. Fusionner lorsque les contrôles et la revue sont terminés.

Une pull request encore en préparation reste en brouillon. Indiquer les contrôles
manquants plutôt que les déclarer réussis. La fusion est une étape distincte de la publication.

## Noms

| Élément | Exemples |
|---|---|
| Branche | `feat/game-board-tests`, `fix/room-loading`, `refactor/project-structure` |
| Commit | `feat: ajouter…`, `fix: corriger…`, `test: vérifier…`, `docs: expliquer…` |

Regrouper les changements qui servent le même objectif. Un déplacement massif de
fichiers mérite sa propre tâche pour faciliter la lecture des modifications fonctionnelles.

## Commandes de vérification

```bash
npm run lint
npm run test -- --run
npm run build
```

Pendant les exercices, `npm run test -- chemin/du/fichier.test.ts` surveille le
fichier choisi. Avant une pull request, exécuter l’ensemble des tests.

Le build local nécessite la configuration Supabase décrite dans le README.
La CI emploie des valeurs fictives et ne vérifie pas les appels à la base distante.

## Tests et apprentissage

- Un groupe `describe` par fonction ou composant.
- Un nom par comportement attendu et une JSDoc concise.
- Une préparation, un appel, puis des assertions.
- Des fonctions de préparation pour les données identiques réellement répétées.
- `test.todo` signale un exercice à écrire ; il ne constitue pas une vérification réussie.

Le code des exercices est écrit pas à pas, puis relu avant l’étape suivante.
Les changements plus larges sont réalisés directement lorsqu’ils sont demandés.
