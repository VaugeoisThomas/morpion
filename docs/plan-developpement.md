# Plan de développement du morpion

Référence : [PRD](products-requierement-document.md).

## Règle de livraison

Chaque itération est développée et vérifiée localement, puis présentée à Thomas.
Le travail et ses vérifications sont consignés à chaque itération dans
[le journal de développement](journal-developpement.md).
Aucun commit, push ou merge n'est effectué sans sa validation explicite.
Les modifications déjà présentes dans le dépôt et le dossier `_backup/` sont conservés.

## Structure prévue

```text
src/
  App.tsx                 # Assemblage des écrans et navigation
  index.css               # Styles globaux et variables visuelles
  components/             # Éléments partagés, seulement en cas de réutilisation
  features/
    home/                 # Accueil
    game/                 # Grille, règles, IA et affichage de partie
    rooms/                # Création, invitation et recherche d'adversaire
    account/              # Connexion et profil
    scores/               # Classement et historique
    chat/                 # Messages et émojis
  lib/
    supabase.ts           # Client Supabase unique
supabase/
  migrations/             # Schéma, sécurité et fonctions serveur versionnés
```

Les dossiers seront créés lorsqu'ils seront nécessaires. Les règles du jeu seront
des fonctions TypeScript indépendantes de React, pour pouvoir les vérifier
simplement. Les composants afficheront l'état et transmettront les actions.
Supabase sera la source de vérité pour les parties multijoueurs : la validation
des coups et des résultats doit être atomique côté serveur pour éviter les
désynchronisations et les coups simultanés.

## Itérations et critères de validation

1. **Accueil fidèle à Figma** : quatre actions demandées, classement hebdomadaire
   et dernières parties, adaptation mobile et desktop, navigation au clavier.
   Les états sans données seront explicites, sans faux scores présentés comme réels.
2. **Partie contre l'ordinateur** : grille 3 × 3, une seule IA, tours alternés,
   cases occupées et actions hors tour bloquées, huit alignements détectés,
   match nul, ligne gagnante surlignée et bouton Rejouer.
3. **Comptes et données Supabase** : authentification, profil et migrations avec
   politiques de sécurité. Vérifier l'isolation des données entre utilisateurs.
4. **Partie entre amis** : options de création, code `A1B2-C3D4`, lien unique,
   entrée par code, synchronisation entre deux navigateurs et revanche dans le salon.
5. **Adversaire aléatoire** : appariement entre humains, gestion de l'attente
   et de son annulation, absence de double attribution d'un joueur.
6. **Robustesse réseau et nettoyage** : reconnexion ; victoire de l'autre joueur
   après une absence supérieure à 30 secondes ; nettoyage serveur des salons vides
   après 10 minutes sans activité de jeu ni de tchat. Vérifier ces délais côté serveur.
7. **Scores et tchat** : historique et classement de la semaine issus des résultats
   serveur, messages textuels et émojis entre participants, validation finale mobile
   et parcours complet entre deux comptes.

À chaque étape : vérifications adaptées au changement, compilation et lint du
code concerné, puis bilan des fonctionnalités terminées et des limites restantes.
Le temps de création et de jointure inférieur à 10 secondes sera mesuré avec le
service Supabase connecté ; il ne peut pas être garanti par une maquette locale.

## Points à préciser avant les étapes concernées

- Options du salon : valeurs autorisées pour le nombre de tours et la durée d'un
  tour ; comportement à expiration du temps ; alternance du premier joueur.
- Scores : barème, départage, définition de la semaine et inclusion éventuelle
  des parties privées ou contre l'ordinateur.
- Comptes : méthode de connexion souhaitée et accès éventuel au jeu sans compte.
- Abandon : traitement d'une déconnexion simultanée et d'un départ volontaire.
- Confidentialité : visibilité de l'historique et accès aux salons publics.

## État initial du 3 novembre 2026

- PRD lu ; socle React, TypeScript et Vite présent.
- De nombreuses modifications locales existent déjà ; aucune n'a été commitée
  dans le cadre de ce travail.
- Fichier Figma identifié, mais inspection des écrans bloquée par la limite
  d'appels MCP du forfait Starter. Aucun écran n'a encore été implémenté ou
  déclaré conforme à la maquette.
- L'itération visuelle nécessite de rétablir l'accès Figma ou de fournir des
  exports des écrans et de leurs ressources.
