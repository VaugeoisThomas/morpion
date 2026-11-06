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

## 10 — Préparation des comptes et de Supabase — 6 novembre 2026 — en cadrage

- Reprise du plan après livraison du mode ordinateur : pull request #2 fusionnée
  sur `main`, commit applicatif `49b035b`, commit de fusion `306b5f3`.
- État du dépôt vérifié : branche `main`, modifications locales du README et
  ressources inutilisées conservées ; aucune configuration `.env` à la racine.
- Prochaine étape du plan : authentification, profil et données Supabase.
- Avant développement, trois choix demandés à Thomas : méthode de connexion,
  accès des invités aux parties en ligne et projet Supabase à utiliser.
- Les choix n'étant pas fixés par le PRD, aucune méthode d'authentification,
  création de projet distant ni migration n'est engagée avant sa réponse.
- Fichier modifié à cette étape : ce journal. Aucun code applicatif modifié.
- Aucun commit, push ou merge effectué pour cette nouvelle étape.

## 11 — Authentification Supabase par lien e-mail — 6 novembre 2026 — à tester

- Choix confirmés par Thomas : connexion par lien e-mail ; compte obligatoire
  pour les parties en ligne ; ordinateur accessible sans compte ; projet
  `maxvfzqcfglvulcmyrnz`.
- Branche : `feat/comptes-supabase`. Livraison du mode ordinateur confirmée :
  pull request #2 fusionnée sur `main`, commit de fusion `306b5f3`.
- Création de `.env` à la demande de Thomas, ignoré par Git. La sauvegarde
  contenait une clé publique du même projet ; URL et rôle anon vérifiés sans
  afficher la clé. Ajout de `.env.example` sans clé.
- Ajout de la dépendance officielle `@supabase/supabase-js` dans `package.json`
  et `package-lock.json`, et du client unique `src/lib/supabase.ts`.
- Ajout de `src/features/account/` : contexte de session, fournisseur React,
  page de connexion, styles et utilitaires d'URL.
- Modification de `src/main.tsx`, `src/App.tsx` et `src/components/AppLayout.tsx` :
  session partagée et accès « Se connecter / Mon compte » sur `#/compte`.
- Connexion préparée via PKCE, restauration de session, déconnexion locale,
  erreurs en français et délai de renvoi de 60 secondes.
- Ajout de `tests/authUrls.test.mjs` : suppression des anciens codes/jetons dans
  l'URL de retour, liens expirés, absence de réflexion du texte d'erreur distant.
- Contrôle réel, en lecture seule, de `/auth/v1/settings` : projet accessible,
  e-mail activé, inscriptions autorisées et confirmation e-mail requise.
- Vérifications : compilation et lint de `src/` réussis, 16 tests réussis,
  contrôle des espaces sur les fichiers de l'itération réussi et `.env`
  confirmé ignoré par Git. Serveur Vite relancé sur `127.0.0.1:5173`, HTTP 200.
- Ajout RLS au PRD par Thomas relevé pendant le travail et conservé. Le contrôle
  global des espaces signale une ligne vide finale dans cet ajout indépendant ;
  le PRD n'a pas été modifié par l'agent pendant cette étape.
- Ajout de `docs/supabase-auth.md` : configuration, parcours et limites.
- Limites : aucun e-mail de test envoyé ; URL de redirection et template e-mail
  distants non inspectés ; contrôle visuel bloqué par l'outil navigateur
  (erreur de démarrage persistante après réinitialisation).
- Intégration Supabase proposée, mais aucun outil Supabase connecté confirmé.
  L'agent ne dispose pas d'action d'installation/connexion automatique ; la
  connexion au service doit être finalisée par Thomas dans l'interface.
- Aucune table, politique, migration ou configuration distante modifiée.
  Profil joueur et contrôle des accès aux futures parties en ligne restent à
  développer après inspection du projet.
- En attente de test réel et validation ; aucun commit, push ou merge effectué.

## Accès d'administration Supabase — 6 novembre 2026

- Thomas demande de créer un accès Supabase pour poursuivre l'inspection du projet.
- État revérifié : intégration disponible mais non installée dans cette conversation.
- Installation et connexion proposées à nouveau à sa demande explicite.
- Aucun outil disponible ne permet de finaliser l'installation ou l'autorisation
  du compte de l'utilisateur à sa place. L'autorisation reste à effectuer dans
  l'interface par Thomas ; aucun accès d'administration n'est encore confirmé.
- Aucun nouveau compte, jeton, rôle ou invitation n'a été créé dans Supabase.

### Vérification après configuration MCP — 6 novembre 2026

- Thomas confirme avoir terminé la connexion et autorise l'inspection.
- Configuration locale vérifiée : serveur `supabase` activé, limité au projet
  `maxvfzqcfglvulcmyrnz`, avec `read_only=true`.
- Aucun outil Supabase n'est cependant exposé à cette conversation après
  redécouverte des outils disponibles ; l'authentification ne peut donc pas
  encore être confirmée par une requête MCP.
- Le diagnostic `codex mcp list` échoue dans cet environnement : répertoire
  utilisateur introuvable (`failed to resolve CODEX_HOME`).
- Aucune donnée ni configuration distante modifiée. Inspection des tables et
  des politiques RLS toujours en attente d'un outil MCP utilisable.

## Itération 12 — Connexion MCP et profil joueur — 6 novembre 2026

- Connexion MCP confirmée sur le bon projet. Les blocages précédents décrivent
  l'état avant cette connexion. PRD, plan et code relus.
- Inspection en lecture seule des trois tables publiques, contraintes, RLS,
  fonctions, trigger et douze migrations. Bilan : `docs/supabase-inspection.md`.
- Correction du blocage d'inscription : le trigger attend un pseudo. Le formulaire
  distingue connexion et création ; seule la création envoie les métadonnées
  du pseudo et de l'avatar initial, avec `shouldCreateUser: true`.
- Ajout de `ProfileEditor.tsx` : lecture, édition du pseudo et de l'avatar,
  sauvegarde avec la session, erreurs, nouvelle tentative, création si profil absent.
  Les lectures sont annulées au démontage ; le composant est lié à l'utilisateur.
- Ajout de `profile.ts` : contraintes et dix avatars. SVG copiés de la sauvegarde
  vers `public/avatars/`, sans modifier la sauvegarde.
- Styles ajoutés dans `AccountPage.css` ; `docs/supabase-auth.md` actualisé.
- Compilation et lint de `src/` réussis, 18 tests réussis, dont pseudos et avatars.
- REST sans session : HTTP 200 et aucun profil retourné malgré un profil existant.
  L'isolation des écritures entre comptes n'est pas encore testée.
- Serveur Vite relancé sur `http://127.0.0.1:5173/`. Connexion et inscription
  inspectées visuellement sur desktop via Opera. Aucun e-mail envoyé.
- Limites : parcours e-mail et sauvegarde réelle à tester ; conformité Figma du
  profil et mobile à vérifier ; migrations de sécurité à préparer. Étape 3 en cours.
- Aucune donnée, migration ou configuration distante modifiée. Aucun commit,
  push ou merge : itération en attente de validation de Thomas.

## Itération 13 — Mot de passe à la connexion — 6 novembre 2026

- Demande de Thomas : e-mail uniquement à la création, plus de lien envoyé à
  chaque connexion. Cette décision remplace le choix initial du magic link.
- Thomas confirme qu'aucun compte sans mot de passe n'est à conserver.
- `AccountPage.tsx` : mot de passe pour se connecter ; pseudo, mot de passe
  et confirmation pour s'inscrire. Minimum de 8 caractères à l'inscription,
  confirmation identique exigée. Champs secrets effacés après réussite et lors
  du changement entre connexion et inscription.
- `authenticate.ts` : inscription avec `signUp`, métadonnées du profil et URL
  de confirmation ; connexion avec `signInWithPassword`. Aucun appel OTP.
- Délai de 60 secondes limité à l'inscription ; il ne bloque plus la connexion.
  Messages adaptés aux identifiants incorrects et à l'adresse non confirmée.
- Message de restauration de session adapté dans `AuthProvider.tsx`.
- `docs/supabase-auth.md`, plan et inspection actualisés pour la nouvelle décision.
- Compilation et lint réussis ; 20 tests réussis. Deux tests vérifient que la
  connexion ne demande ni inscription ni OTP et que l'inscription transmet les
  métadonnées exigées par le trigger. Contrôle des espaces réussi.
- Aucun compte créé ni e-mail de test envoyé par l'agent. Confirmation d'inscription
  et connexion réelles à vérifier par Thomas dans `http://127.0.0.1:5173/#/compte`.
- Aucune configuration Supabase modifiée. Aucun commit, push ni merge sans validation.

## Itération 14 — Migrations et tests d'isolation PostgreSQL — 6 novembre 2026

- Reprise de l'étape 3, sans activer les parties en ligne avant sa validation.
- Douze migrations historiques récupérées en lecture seule depuis la table
  `supabase_migrations.schema_migrations`, enregistrées avec leurs versions
  originales dans `supabase/migrations/`. Aucun rejeu sur la base distante.
- Migration locale `202611060001_restrict_client_permissions.sql` préparée :
  profils réservés aux comptes, édition des seules colonnes pseudo/avatar,
  résultats non inscriptibles par un client, création des salles limitée aux
  options, suppression des privilèges inutiles et de l'exécution directe du trigger.
- Dépendance de développement `@electric-sql/pglite` ajoutée pour exécuter
  PostgreSQL en mémoire sans Docker ni accès au service distant. Aucun ajout
  dans le code livré au navigateur. Scripts `npm test` et `npm run test:db` ajoutés.
- `tests/database.test.mjs` : sept tests exécutent les migrations avec deux
  identités simulées. Vérification des lectures/écritures RLS, de la protection
  des résultats, du refus de TRUNCATE, du trigger et des RPC historiques de salle.
- Correction de mon constat précédent : un index unique sur `lower(username)`
  existe bien. Un test vérifie les doublons sans distinction de casse ; l'éditeur
  de profil affiche désormais « Ce pseudo est déjà utilisé » sur erreur 23505.
- Documentation mise à jour : `supabase/README.md`, inspection, connexion et plan.
- Les 27 tests passent, dont les sept tests PostgreSQL. Compilation et lint
  contrôlés pour cette itération ; aucun parcours SMTP/Realtime couvert par PGlite.
- Aucun compte créé et aucune donnée, configuration ou migration distante modifiée.
  Les protections nouvelles sont locales et leur application reste à effectuer
  après revue, avec un accès de migration autorisé (MCP actuellement en lecture seule).
- Aucun commit, push ou merge : attente de validation de Thomas.

## Itération 15 — Accès applicatifs par API Supabase — 6 novembre 2026

- Thomas confirme l'utilisation de l'API Supabase pour les requêtes de l'application.
- Audit de `src/` : Auth utilise le SDK officiel ; les profils passent par
  `.from('profiles')`. Aucune connexion PostgreSQL directe, aucun appel PGlite
  ni requête SQL exécutée dans le code applicatif.
- Règle d'architecture ajoutée au plan : client Supabase unique, API Auth et
  données, RPC pour les futures actions atomiques, Realtime pour les événements.
- Les migrations SQL et tests PostgreSQL restent des outils de développement.
  Aucun changement fonctionnel nécessaire ; aucune nouvelle dépendance ajoutée.
- Vérification par recherche des accès dans `src/` et `package.json`.
  Aucun changement distant ni opération Git de livraison effectué.

## Itération 16 — Confirmation d'inscription et validation du parcours — 6 novembre 2026

- Thomas confirme que le parcours réel d'inscription et de connexion a déjà été
  effectué et validé. Cette validation est acquise et ne sera plus redemandée.
  Plan et documentation Auth corrigés en conséquence.
- Finalisation du suivi interrompu : bouton de renvoi de confirmation dans
  « Créer un compte », via l'API Supabase `auth.resend` de type `signup`.
  Adresse validée avant l'appel, délai de 60 secondes, erreurs réseau et limites
  traitées. Aucun renvoi automatique lors d'une connexion par mot de passe.
- Messages des liens expirés adaptés et champs mobiles réglés à 16 px pour
  éviter le zoom automatique sur certains navigateurs mobiles.
- Règles des salles validées par Thomas : 1/3/5 manches, 15/30/60 secondes,
  X commence chaque manche, dépassement du temps = perte de la manche.
- Après reprise : compilation et lint de `src/` et `tests/` réussis, 27 tests réussis.
- Limites distinctes du parcours déjà validé : renvoi de confirmation et rendu
  mobile pas encore vérifiés en réel, contrôle visuel interrompu par l'outil.
- Migration de sécurité toujours locale, non appliquée sur Supabase. Aucun
  commit, push ou merge effectué pendant cette mise à jour du suivi.

## Livraison du jalon 3 validée — 6 novembre 2026

- Thomas valide explicitement le commit, push, merge et l'application de la
  migration de sécurité. Parcours réel d'inscription/connexion déjà validé.
- Migration appliquée avec succès via l'API MCP Supabase ; le service attribue
  la version `20261106142024`. Fichier local renommé pour conserver cet alignement.
- Droits distants contrôlés : lecture anonyme des profils refusée ; édition du
  pseudo autorisée, dates protégées ; écriture des résultats et scores refusée ;
  TRUNCATE et exécution directe du trigger retirés aux clients.
- Conseiller sécurité relancé : avertissement du trigger corrigé. Les quatre RPC
  de salle restent volontairement exécutables par les comptes authentifiés ;
  leurs garde-fous ont été testés localement. Protection des mots de passe compromis
  toujours désactivée côté Auth, non modifiée par cette migration.
- Plan, documentation Auth et état de la migration mis à jour. Derniers contrôles
  applicatifs : 27 tests, compilation et lint réussis.
- Commit applicatif `6a70e33` poussé sur `feat/comptes-supabase`, livraison via
  [la pull request #3](https://github.com/VaugeoisThomas/morpion/pull/3).
  La fusion sur `main` est autorisée par Thomas dans cette même validation.
  `.env` reste ignoré ; les modifications indépendantes préexistantes sont exclues.
- Contrôle GitHub SonarCloud initial en échec : 7,9 % de duplication, provenant
  exclusivement des deux migrations historiques qui redéfinissent la même fonction.
  Ajout de `.sonarcloud.properties` excluant ces deux fichiers du seul calcul
  de duplication ; historique SQL inchangé, analyse des problèmes conservée.
- Fusion du jalon 3 confirmée : PR #3, commit de fusion `5b0dae3` ; `main`
  local synchronisé. SonarCloud réussi sur la tête `96f9cdd` avant fusion.

## Itération 17 — Parties entre amis — 6 novembre 2026

- Nouvelle branche `feat/parties-entre-amis` à partir du jalon 3 livré.
- Règles conservées : 1/3/5 manches, 15/30/60 secondes, X commence, nuls compris,
  dépassement du temps = perte de la manche. Thomas valide aussi l'accord des
  deux joueurs pour rejouer avec les mêmes options dans le même salon.
- Figma : session créée, métadonnées des écrans et identifiants relus ; contexte
  détaillé et captures refusés par le quota Starter. Ressources et composants
  locaux réutilisés, conformité visuelle des nouveaux écrans non affirmée.
- `src/features/rooms/` : types et invitations, API Supabase, abonnement Realtime,
  formulaires de création/jointure, contrôle de session, attente et plateau en ligne.
- `src/navigation.ts` : routes créer/rejoindre/salle et retour au lien d'invitation
  après authentification. Accueil activé pour créer et rejoindre ; recherche aléatoire
  toujours désactivée. Layout adapté au nouveau type de page.
- `GameBoard.tsx` extrait du mode ordinateur : même grille et mêmes SVG partagés
  avec le multijoueur, sans modifier les règles ni le centrage du mode ordinateur.
- Migration `20261106144555_friend_rooms.sql` appliquée via l'API MCP : création
  idempotente, code généré serveur, état de manche, heure de départ du tour,
  numéro de série et accords de revanche. Coups/actions sous verrou, contrôle des
  participants et refus des demandes de manche/série périmées.
- Les anciennes RPC de coup/démarrage et l'insertion directe sont retirées aux
  clients pour empêcher le contournement des nouvelles règles. La jointure existante
  conserve son verrou et le contrôle des deux places.
- Chronomètre vérifié côté serveur ; les clients signalent l'expiration, qui
  attribue un seul point et termine la manche. Entre les manches, pas de compteur.
- Synchronisation : abonnement filtré, relecture après action/reconnexion/retour
  d'onglet et toutes les cinq secondes ; annulation des requêtes au démontage.
- API réelle sans session : création refusée (`42501`). Privilèges distants et
  publication Realtime contrôlés ; aucune salle réelle ni compte créé par l'agent.
- 34 tests réussis, compilation et lint de `src/` et `tests/` réussis. Couverture
  ajoutée : création répétée, troisième joueur, coups hors tour/occupés, requêtes
  périmées, expiration, scores/nuls, revanche à deux accords et annulation en attente.
- Documentation de parcours et de vérification : `docs/parties-entre-amis.md`.
  Plan et références Figma actualisés.
- Limites : test Realtime à deux comptes, contrôle desktop/mobile et mesure du
  délai de création/jointure à effectuer. Déconnexions >30 secondes et nettoyage
  restent au jalon 6 ; tchat et historique au jalon 7. Jalon 4 en attente de revue.
- Serveur local accessible sur `http://127.0.0.1:5173/` (HTTP 200). Aucun commit,
  push ou merge de cette branche sans nouvelle validation de Thomas.

## Livraison du jalon 4 validée — 6 novembre 2026

- Thomas confirme : « Tout passe. Et sur deux navigateurs différents. »
  Validation fonctionnelle du jalon 4 enregistrée, y compris le parcours réel
  multijoueur. Livraison commit, push et merge engagée conformément à la règle convenue.
- Plan et documentation du mode amis actualisés. Derniers contrôles locaux :
  34 tests réussis, compilation et lint réussis ; migration déjà appliquée.
- La conformité visuelle exacte à Figma et la mesure chiffrée de performance
  ne sont pas déduites du seul retour fonctionnel.
- `.env` et modifications indépendantes préexistantes exclus de la livraison.
- Commit applicatif `1c517c7` poussé sur `feat/parties-entre-amis` ; livraison via
  [la pull request #4](https://github.com/VaugeoisThomas/morpion/pull/4).
