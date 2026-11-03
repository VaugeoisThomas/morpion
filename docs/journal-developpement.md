# Journal de développement

Ce fichier est mis à jour à chaque itération. Il décrit le travail effectué,
les fichiers concernés, les vérifications et les points en attente.
Aucun commit, push ou merge n'est réalisé sans validation explicite de Thomas.
Après chaque validation explicite d'une étape, effectuer le commit, le push
de sa branche, puis son merge sur `main`, sans redemander cette même validation.
La validation d'une étape ne vaut pas validation des étapes suivantes.

## 1 — Cadrage — 3 novembre 2026

- Lecture de `docs/products-requierement-document.md` et inspection du socle React/Vite.
- Ajout de `docs/plan-developpement.md` : structure simple, découpage des étapes,
  critères de validation et questions produit à résoudre avant les étapes concernées.
- Constat : des modifications non commitées existaient déjà ; elles sont conservées.
- Validation : découpage validé par Thomas.

## 2 — Règles du jeu — 3 novembre 2026

- Ajout de `src/features/game/game.ts` : grille de neuf cases, tours alternés,
  refus des coups interdits, huit alignements gagnants, match nul et nouvelle partie.
- Ajout de `tests/game.test.mjs` : huit tests des règles, dont victoire au neuvième
  coup, blocage après résultat final et absence de mutation de la grille précédente.
- Suppression de l'import `useState` inutilisé dans `src/App.tsx`, qui empêchait
  la compilation du socle existant.
- Vérifications : huit tests réussis, compilation et lint des fichiers concernés réussis.
- Limite : moteur non raccordé à un écran de jeu ; aucune intégration Supabase.

## 3 — Référence Figma et accueil — 3 novembre 2026

- Connecteur Figma bloqué par le quota Starter. Accès visuel ensuite obtenu dans
  Opera ; export du frame desktop `5:28822` vers `docs/figma/accueil-desktop.png`.
- Ajout de `src/features/home/Home.tsx` : accueil, navigation latérale,
  menu repliable sur petits écrans, quatre actions et deux panneaux sans données.
- Modification de `src/App.tsx` pour afficher l'accueil ; remplacement des styles
  du socle dans `src/App.css` et `src/index.css`.
- Copie des ressources locales depuis la sauvegarde vers `public/figma/home/`,
  `public/figma/background/` et `public/fonts/`, licence Inter comprise.
- Modification de `index.html` : langue française et titre Morpion.
- Ajout de `docs/figma/README.md` pour documenter les sources et les limites.
- Vérifications : compilation et lint de `src/` réussis ; huit tests des règles
  réussis ; accueil desktop inspecté dans le navigateur local.
- Aperçu : http://127.0.0.1:5173/ (nécessite le serveur Vite lancé).
- Limites : boutons des modes désactivés, comptes et données non intégrés,
  profil absent, conformité à la maquette mobile non vérifiée.
- Validation : première intégration visuelle présentée ; ajustement du fond demandé.

## 4 — Fond fourni et journal — 3 novembre 2026

- Demande : utiliser l'image existante nommée « background » à la place des
  décorations assemblées et consigner chaque itération dans un fichier lisible.
- Ajout de ce journal, avec récapitulatif des étapes précédentes.
- Image retrouvée après précision de Thomas :
  `C:/Users/thaed/Downloads/Fond du site — Morpion.png`, 1 200 × 600 pixels.
- Copie intacte vers `public/background.png` ; image appliquée au fond de
  `.app-shell` dans `src/App.css`, couvrant aussi la navigation latérale.
- Suppression du bloc de décorations dans `src/features/home/Home.tsx` et de
  ses styles pour éviter la superposition des anciens symboles au nouveau fond.
- Affichage sans répétition, proportions conservées avec `cover`, centrage
  horizontal en haut. Selon la fenêtre, les bords de l'image sont recadrés.
- Mise à jour de `docs/figma/README.md` pour documenter la provenance du fond.
- Vérifications : compilation et lint de `src/` réussis ; rendu desktop inspecté
  dans Opera sur http://127.0.0.1:5173/ ; copie de l'image identique à l'original
  (empreintes SHA-256 comparées). Le rendu mobile n'a pas été inspecté à cette étape.
- Validation : remplacement du fond à présenter à Thomas.
- Aucune opération de commit, push ou merge effectuée.

## 5 — Revue du rendu de l'accueil — 3 novembre 2026

- Demande : rechercher et corriger les anomalies visuelles par comparaison avec
  `docs/figma/accueil-desktop.png` et avec le fond fourni.
- Fichier de code modifié : `src/App.css`.
- Suppression des marges calculées à partir de 1 400 pixels : elles repoussaient
  le contenu trop loin vers la droite. Les marges desktop restent désormais
  cohérentes avec celles de l'écran de référence.
- Fond desktop dimensionné selon la largeur (`100% auto`) au lieu de `cover` :
  changer la hauteur de la fenêtre ne change plus l'échelle des motifs.
- Fond opaque sur la navigation desktop : les symboles du fond ne traversent
  plus les liens de navigation.
- Ajustement du rapport de largeur des panneaux à 450 / 401, selon l'export.
- Ajout d'un contour intérieur et d'angles arrondis à l'enveloppe desktop.
- Mise en page mobile : hauteur de la barre de navigation indépendante de celle
  du contenu ; adaptation du fond et suppression du contour desktop.
- Mise à jour de `docs/figma/README.md` sur le cadrage du fond et la vérification.
- Vérifications : compilation et lint de `src/` réussis ; comparaison visuelle
  dans Opera sur grand écran et à 1 200 pixels de large ; inspection de
  l'affichage à 375 pixels, des quatre cartes et du menu mobile ouvert.
- La simulation de hauteur n'a pas permis de garantir une capture exacte à
  600 pixels ; aucune comparaison automatisée pixel par pixel n'a été effectuée.
- Limites conservées et explicites : scores sans données, profil non intégré,
  boutons des modes désactivés, maquette mobile non exportée. L'adaptation mobile
  observée ne constitue donc pas une validation de sa fidélité au design mobile.
- Validation : corrections du rendu de l'itération 5 validées par Thomas.
  Les limites listées ci-dessus restent à traiter dans les étapes suivantes.
- Aucun commit, push ou merge effectué.

## Livraison Git des étapes validées — 3 novembre 2026

- Thomas a confirmé que la validation d'une étape déclenche son commit, son
  push et son merge. L'absence de livraison après la validation de l'itération 5
  était une mauvaise application de cette consigne.
- Livraison préparée sur `feat/accueil-valide` : socle React/Vite nécessaire,
  règles du jeu et tests, accueil, ressources locales et documentation.
- Les fichiers de l'application étant encore non suivis depuis l'initialisation,
  cette livraison constitue le premier commit de leur implémentation.
- Rétablissement des exclusions `_backup/`, `.env`, `.env.*`, `coverage/` et
  `*.tsbuildinfo` dans `.gitignore`, en conservant les exclusions du socle Vite.
- Sauvegarde privée et modification locale du README générique exclues du commit.
- Validation de livraison : autorisée explicitement par Thomas après validation
  du rendu ; résultats GitHub à communiquer à l'issue de l'opération.
