# Références Figma

- Source : https://www.figma.com/design/36tNxelVtEbCE8wmChoqRX/Morpion
- `accueil-desktop.png` : export PNG du frame `5:28822`, 1 200 × 600 pixels,
  récupéré depuis Figma dans Opera le 3 novembre 2026.
- Les SVG de `public/figma/home/` et `public/figma/background/`, ainsi que la police
  Inter et sa licence, sont repris des exports locaux de `_backup/existing-project/`.
  La sauvegarde n'a pas été modifiée.
- `public/background.png` : image fournie par Thomas, copiée depuis
  `Téléchargements/Fond du site — Morpion.png` (1 200 × 600 pixels).
  Elle remplace les décorations assemblées de l'accueil, sans répétition ni
  déformation. Sur desktop, sa largeur suit celle de la page et sa hauteur
  reste proportionnelle ; la couleur de fond prolonge l'image si nécessaire.
  Sur petits écrans, sa hauteur suit celle de la page, avec recadrage horizontal.
  Le panneau de navigation desktop possède un fond opaque comme dans l'export.

L'accueil est une première intégration visuelle. Le mode ordinateur est désormais
accessible ; les trois autres modes sont désactivés en attendant leurs itérations.
Les panneaux
de scores affichent des états sans données ; aucun joueur fictif n'est présenté
comme utilisateur connecté. Le profil nécessite l'intégration des comptes.

Le rendu desktop a été inspecté dans le navigateur local à la largeur de référence
de 1 200 pixels et sur grand écran. L'adaptation à 375 pixels et l'ouverture du
menu mobile ont été inspectées ; la conformité à la maquette mobile reste à
vérifier après son export. Le connecteur Figma MCP reste limité par le quota du
forfait Starter.

## Mode ordinateur

Frame inspecté dans l'application Figma : `108:6362`, « Jouer contre
l'ordinateur — Desktop », 1 200 × 720 pixels. Les choix de symbole et de manches
sont conservés sur accord de Thomas. Le panneau des trois difficultés est
remplacé par une présentation de l'adversaire unique, conformément au PRD.
Les symboles de la grille proviennent de `public/figma/game/`, copiés depuis
la sauvegarde. L'écran de partie est adapté au mode local sans tchat ni compte.

## Jeu en cours

`jeu-en-cours-desktop.png` : export PNG du frame `5:29319`, 1 140 × 520 pixels,
enregistré depuis l'application Figma le 3 novembre 2026. Cette référence sert
au bandeau des scores, aux repères de manches, à l'indicateur de tour et aux
cases espacées. Le mode ordinateur conserve les noms « Toi » et « Ordinateur »
et un retour à l'accueil. Les avatars des comptes et le tchat entre humains
restent réservés à leurs étapes fonctionnelles.
