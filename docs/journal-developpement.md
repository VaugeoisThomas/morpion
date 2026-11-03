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

## 6 — Partie contre l'ordinateur — 3 novembre 2026 — validé

- Branche de travail : `feat/partie-ordinateur`.
- Livraison précédente confirmée : commit `f741aad`, pull request #1 fusionnée
  sur `main` (commit de fusion `628f828`).
- Inspection du frame Figma ordinateur `108:6362` dans l'application Figma.
  Il propose trois difficultés, en contradiction avec le PRD qui en exclut
  plusieurs. Le choix de symbole et du nombre de manches pour ce mode n'est
  pas précisé dans le PRD. Thomas a autorisé le choix X/O et 1, 3 ou 5 manches,
  avec une seule IA. Il a précisé que X commence chaque manche et que les
  matchs nuls comptent dans le total. Aucune alternance du premier symbole.
- Ajout de `src/features/game/computer.ts` : une seule IA, sans dépendance,
  fondée sur l'examen des suites possibles (minimax). Les règles existantes
  restent la référence pour valider les coups et détecter les résultats.
- Ajout de `tests/computer.test.mjs` : attente du tour, arrêt après résultat,
  victoire immédiate, blocage adverse, absence de mutation et exploration
  des suites de coups humains pour les deux symboles.
- Ajout de `src/features/game/ComputerGame.tsx` et `ComputerGame.css` :
  configuration, grille 3 × 3, tour courant, score de série, surbrillance de
  la ligne gagnante, manche suivante et relance complète de la série.
- Extraction de la navigation dans `src/components/AppLayout.tsx`, partagée
  entre les deux écrans ; modification de `src/App.tsx` pour naviguer entre
  accueil et ordinateur avec des liens `#/` et `#/ordinateur`, sans bibliothèque.
- Modification de `src/features/home/Home.tsx` : accès ordinateur activé ;
  les trois autres modes restent désactivés jusqu'à leurs étapes respectives.
- Copie des deux symboles SVG de la sauvegarde vers `public/figma/game/`.
- L'ordinateur attend 400 ms avant son coup ; toutes les cases sont bloquées
  pendant son tour. Le délai est annulé si l'écran est quitté.
- Vérifications : les 13 tests des règles et de l'IA passent. Un premier test
  avait montré que l'IA pouvait retarder une victoire déjà disponible ; le score
  tient désormais compte du nombre de cases restantes pour privilégier une
  victoire immédiate.
- Parcours inspectés dans Opera : choix O / une manche, premier coup automatique
  de X, réponse à deux coups humains, défaite et score 0–1, diagonale gagnante
  surlignée, toutes les cases bloquées après le résultat et bouton Rejouer.
  Relance vérifiée ; puis choix X / trois manches et passage de la première à
  la deuxième manche avec grille vide, X au premier tour et score conservé.
- Rendu de la grille et des scores inspecté à 375 pixels de large, sans
  débordement horizontal visible. La maquette mobile reste à exporter : cette
  inspection ne garantit pas une fidélité visuelle complète.
- Les scores de cette série sont temporaires dans l'écran, sans enregistrement
  dans le classement ni l'historique. Supabase et les comptes restent aux étapes suivantes.
- Limites : pas de sauvegarde après rechargement ou retour à l'accueil ; pas de
  validation manuelle d'une série complète de cinq manches à cette étape.
- Validation technique finale : `npm run build`, lint de `src/`, les 13 tests
  des règles et de l'IA et `git diff --check` réussis.
- Aucun commit, push ou merge de cette itération avant sa validation.

## 7 — Adapter la partie à la maquette Jeu en cours — 3 novembre 2026 — validé

- Demande de Thomas : reprendre le rendu de l'écran « Jeu en cours » de Figma.
- Inspection et export du frame `5:29319` (1 140 × 520) vers
  `docs/figma/jeu-en-cours-desktop.png` ; provenance documentée dans
  `docs/figma/README.md`.
- Fichiers applicatifs modifiés : `src/features/game/ComputerGame.tsx` et
  `src/features/game/ComputerGame.css`.
- Bandeau supérieur avec noms, symboles, scores, numéro de manche et pastilles
  de progression. Le retour à l'accueil reste disponible dans ce bandeau.
- Navigation latérale et titre de configuration masqués pendant la partie,
  comme dans la référence de jeu en cours ; configuration et accueil conservés.
- Indicateur de tour avec symbole et texte à gauche du plateau sur desktop.
- Grille à neuf cases sombres espacées, contours discrets, angles arrondis,
  symboles agrandis ; fond PNG fourni conservé.
- Adaptation mobile : bandeau sur deux lignes, indicateur au-dessus du plateau.
- Règles, IA, symboles choisis, calcul des scores, manches et relance inchangés.
- Le tchat de la référence est réservé aux parties entre humains selon le PRD.
  Aucun faux message ni avatar de compte n'est ajouté au mode ordinateur.
- Vérifications : compilation, lint de `src/`, 13 tests des règles et de l'IA
  et `git diff --check` réussis. Nouveau rendu desktop inspecté dans Opera.
  À 375 pixels : bandeau, retour accueil, progression, indicateur et neuf cases
  inspectés sans débordement visible ; un coup X et la réponse O ont été vérifiés
  visuellement avec les nouveaux symboles agrandis.
- Cette révision complète l'itération 6, toujours en attente de validation finale.
  Aucun commit, push ou merge de ces deux étapes avant cette validation.

## 8 — Centrage de la grille desktop — 3 novembre 2026 — validé

- Demande : centrer la grille dans la largeur de l'écran desktop.
- Modification de `src/features/game/ComputerGame.css` : colonnes latérales
  de largeur identique autour de la colonne de grille de 368 pixels.
  Le conteneur étant lui-même centré, l'axe horizontal de la grille coïncide
  désormais avec celui de l'écran, indépendamment de l'indicateur à gauche.
- Les dispositions mobile et tablette ainsi que les règles restent inchangées.
- Vérifications : centrage horizontal inspecté sur grand écran dans Opera ;
  compilation et `git diff --check` réussis.
- Correction incluse dans la branche `feat/partie-ordinateur`, en attente de
  validation avant commit, push et merge.

## 9 — Plateau plus grand et centré sur desktop — 3 novembre 2026 — validé

- Demande : agrandir légèrement le plateau sur grand écran et le centrer
  horizontalement et verticalement pour mieux occuper l'espace disponible.
- Modification de `src/features/game/ComputerGame.css` uniquement pour les
  écrans de plus de 900 pixels : bandeau en première ligne, zone de jeu dans
  l'espace restant, contenu centré verticalement et colonnes latérales symétriques.
- Plateau adaptatif jusqu'à 480 pixels au lieu de 368 pixels ; sa taille tient
  aussi compte de la hauteur disponible pour les fenêtres desktop moins hautes.
- Symboles de la grille agrandis de 15 % sur desktop. Mobile et tablette conservés.
- Vérifications : compilation et `git diff --check` réussis ; rendu grand écran
  inspecté dans Opera avec une partie active. Plateau de 480 pixels centré
  dans la largeur et dans la hauteur de la zone située sous le bandeau des scores.
- Toujours en attente de validation de l'ensemble du mode ordinateur avant
  commit, push et merge de `feat/partie-ordinateur`.

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
- Livraison effectuée : pull request https://github.com/VaugeoisThomas/morpion/pull/1
  fusionnée sur `main`, commit de fusion `628f828`. La branche locale `main`
  a été synchronisée avant de commencer l'itération 6.

## Validation et livraison du mode ordinateur — 3 novembre 2026

- Thomas a validé le mode ordinateur et les révisions visuelles des itérations 6 à 9.
- Cette validation remplace les mentions d’attente figurant dans les comptes rendus précédents.
- Livraison autorisée : commit de la branche `feat/partie-ordinateur`, push puis fusion sur `main`.
- Vérifications déjà réalisées : compilation, lint de `src/`, 13 tests des règles et de l’IA ; parcours de jeu et rendu desktop/mobile inspectés.
- Le README générique, `public/icons.svg` et les ressources inutilisées de `src/assets/` restent hors de cette livraison.
