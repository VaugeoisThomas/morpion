## PRD - Morpion en ligne multijoueur

Document de référence produit. A placer dans `docs/` du repos

**Status** v1 en production, en revue avec moi même.
**Dernière mise à jour** le 03/11/2026

## Context

Le but est de créer un morpion en ligne, accessible en un clic, permettant à deux personnes de pouvoir jouer ensemble en temps réel

**Objectif principal** Proposer une expérience de jeu fluide, instantanée et sans bug de synchronisation.
**KPIs de succès**
    - temps de création des salles / jointures d'une partie < 10 secondes

## Cible

Thomas (Le joueur occasionnel) - Pendant une pause lance une partie de morpion contre un collègue via un simple code partagé. Il cherche à ce que le jeu soit rapide est simple d'utilisation.

Amelie (La joueuse mobile) - Joue des parties sur son téléphone dans le métro. Elle a besoin d'une interface tactile irréprochable et d'une gestion propres des déconnexions réseau.

Yvan (Le joueur passionné) - Il joue beaucoup au jeu dès qu'il rentre de chez lui après le travail. Il a besoin que ses scores soit partagé dans un tableau visible par tous, afin de faire une compétition.

## Périmètre

# Dans le périmètre
- grille classique de 3X3
- mode de jeu :
    - Jouer contre une intelligence artificielle
    - Jouer avec un ami (génération de lien d'invitation unique au format A1B2-C3D4)
    - Jouer contre une autre personne (Jouer contre un inconnu au hasard)
- mise à jour en temps réél via Supabase
- detection automatique de la victoire, du match nul ou de la défaite
- interface responsive (mobile et desktop)
- systeme de compte utilisateur, leaderboard, et historique des scores
- tchat textuel ou émojie pendant une partie contre un autre joueur

# Hors périmètre

- grille de jeu fantaisie (4X4, 5X5 ...)
- plusieur difficulté de l'ia

## Parcours utilisateur & specifications

# Ecran d'accueil

- L'utilisateur arrive sur une page épurée avec 4 boutons ( Jouer en ligne, Jouer contre l'ordinateur, créer une partie, rejoindre une partie) et deux cadres (Classement de la semaine,  dernière parties jouée).

- Au clic sur le bouton Jouer en ligne: Lance une recherche d'un adversaire aléatoire (ordinateur non compris)
- Au clic sur le bouton Jouer contre l'ordinateur: Lance une partie contre une intelligence artificielle
- Au clic sur le bouton Créer une partie: Créer une salle avec différentes options: nombre de tours, temps du tour, symbole choisi, partie privée ou publique
- Au clic rejoindre une partie : Rejoind une partie avec un code au format A1B2-C3D4 donné par un autre joueur

# Ecran de jeu

Story 1: Déroulement du jeu

En tant que joueur x, je veux cliquer sur une case vide à mon tour afin de placer mon symbole
  - Indicateur visuel simple et clair pour savoir à qui est le tour
  - Impossible de cliquer sur une case déjà occupée.
  - Impossible de jouer pendant le tour de l'adversaire

Story 2: Fin d'une partie

    - La victoire est déclarée dès que 3 symboles sont alignés (horizontal, vertical ou diagonale)
    - La ligne gagnante doit être surlignée visuellement avec un léger fond
    - Si 9 cases sont remplies sans alignements, le match est nul
    - Un bouton "Rejouer" apparait pour lancer une nouvelle partie dans ce même salon.

## Exigences techniques

- Temps réel : Utilisation obligatoire de Supabase pour gérer le temps réél
- Gestion des données : Utilisation obligatoire d'utiliser Supabase
- Gestion des déconnexions : Si un joueur quitte ou perd sa connexion pendant plus de 30 secondes l'autre joueur est déclaré vainqueur automatiquement
- Persistances: Les salons de jeux vides doivent être automatiquement nettoyer du serveur après 10 minutes d'inactivité de partie ou de tchat

## Design

Le site doit se rapprocher le plus fidèlement possible de la maquette disponible via : https://www.figma.com/design/36tNxelVtEbCE8wmChoqRX/Morpion?t=ELyXBb7XLimyg169-0
