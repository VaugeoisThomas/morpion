# Parties entre amis — jalon 4

Développement sur `feat/parties-entre-amis`. Jalon validé par Thomas le
6 novembre 2026 après test sur deux navigateurs différents.

## Parcours développé

1. Sur l'accueil, choisir « Créer une partie ». Un compte est requis ; après
   connexion, l'invitation ou l'écran de création est retrouvé dans le même onglet.
2. Choisir visibilité, 1/3/5 manches, symbole et 15/30/60 secondes par tour.
3. Le serveur génère un code `A1B2-C3D4`, protégé par un index unique. Une même
   demande répétée après une réponse perdue retrouve la salle déjà créée.
4. Partager le code ou le lien. L'ami se connecte, rejoint explicitement et occupe
   la seconde place. La jointure verrouille la salle ; une troisième place est refusée.
5. L'hôte démarre. X commence chaque manche ; les coups sont validés côté serveur.
6. Un alignement termine la manche et donne un point. Un nul compte comme manche,
   sans point. Dépasser le temps fait perdre la manche au joueur dont c'est le tour.
7. L'hôte lance la manche suivante. À la fin de la série, « Rejouer » attend
   l'accord des deux joueurs, puis remet les scores à zéro dans le même salon.

Avant le démarrage, l'invité peut quitter et libérer sa place ; l'hôte peut annuler.
Pendant une partie, revenir à l'accueil ne déclare pas encore un abandon : la
gestion des déconnexions de plus de 30 secondes appartient au jalon 6.

## Structure et synchronisation

- `src/navigation.ts` : routes par hash et retour après authentification.
- `features/rooms/rooms.ts` : types, code et URL d'invitation, temps restant.
- `roomApi.ts` : appels API Supabase pour créer, joindre, lire et agir.
- `useRoom.ts` : abonnement Realtime filtré par identifiant et lectures sous RLS.
  Relit après abonnement/reconnexion, retour d'onglet et toutes les cinq secondes
  pour rattraper un événement manqué. Nettoie abonnement et requêtes au démontage.
- `RoomSetup.tsx`, `RoomsPage.tsx`, `RoomView.tsx` : formulaires, contrôle de session,
  attente et partie. `GameBoard.tsx` partage la grille avec le mode ordinateur.

Le navigateur ne modifie pas directement plateau, scores ou chronomètre. Les RPC
contrôlent session, appartenance, manche et numéro de série sous verrou de ligne.
L'heure serveur tranche les expirations ; l'affichage du compte à rebours est une
estimation sur l'horloge locale. Un participant signale périodiquement l'expiration.
Si tous les navigateurs sont fermés, aucune tâche planifiée ne traite encore les
délais : la règle des déconnexions et le nettoyage serveur restent au jalon 6.

## État Supabase

Migration `20261106144555_friend_rooms.sql` appliquée via l'API MCP. La version
locale correspond à celle du service. Ajoute l'état de manche, départ du tour,
numéro de série et accords de revanche. Les anciennes RPC de démarrage/coup sont
retirées des droits clients pour empêcher le contournement du chronomètre.

Contrôles distants : création/action réservées aux comptes, insertion directe
de salle refusée, Realtime déjà publié. Requête réelle via SDK sans session :
création refusée (`42501`). Aucun compte de test ni salle réelle créé par l'agent.

Le conseiller signale les trois RPC SECURITY DEFINER accessibles aux comptes :
c'est leur usage prévu, avec contrôles d'identité internes. Voir
[la règle du conseiller](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).

## Vérification à deux comptes

Utiliser deux navigateurs ou un navigateur normal et une fenêtre privée, avec
deux comptes distincts. Des onglets du même navigateur partagent normalement la session.

- Créer puis partager le lien : vérifier l'arrivée du second joueur et le refus d'un troisième.
- Jouer une victoire et un nul, puis vérifier les scores et la manche suivante sur les deux écrans.
- Laisser un tour expirer : une seule victoire doit être attribuée à l'adversaire.
- Demander une revanche d'un côté : elle démarre uniquement après le second accord.
- Recharger un écran, puis couper/rétablir son réseau : l'état serveur doit être retrouvé.
- Mesurer la création et jointure : objectif PRD inférieur à 10 secondes, non encore mesuré.

Les tests PostgreSQL locaux couvrent les droits, coups hors tour, demandes périmées,
troisième joueur, expiration, compte des scores, nuls et accords de revanche.
Le test fonctionnel réel sur deux navigateurs différents a été effectué et
confirmé par Thomas le 6 novembre 2026. Aucun temps chiffré de création/jointure
n'a été communiqué ; la mesure de l'objectif de performance reste à consigner.

## Design et périmètre restant

Références identifiées : création desktop `63:862`, jointure `63:1097`, attente
`5:29204`, jeu `5:29319`. Le quota Starter bloque les exports détaillés MCP.
Les ressources et composants locaux déjà issus de Figma sont réutilisés. La
conformité des nouveaux écrans desktop/mobile reste à vérifier visuellement.

Recherche d'adversaire, historique/classement, tchat, abandon automatique et
nettoyage des salles restent à leurs prochains jalons. L'option publique est
conservée ; la découverte des salles publiques n'est pas encore développée.
