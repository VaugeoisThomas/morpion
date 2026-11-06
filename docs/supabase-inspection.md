# Inspection du projet Supabase

Projet : `maxvfzqcfglvulcmyrnz`. Inspection du 6 novembre 2026, en lecture seule.
Inspection initiale sans modification. La migration de sécurité a ensuite été
appliquée le 6 novembre 2026 sur validation explicite de Thomas.

## Schéma existant

Douze migrations distantes sont enregistrées, du 4 au 16 octobre 2026.
Leurs instructions ont été récupérées depuis `supabase_migrations.schema_migrations`
dans `supabase/migrations/`, avec leurs versions originales. Elles sont historiques
et ne doivent pas être rejouées sur le projet existant. Voir `supabase/README.md`.

| Table | RLS | Lecture | Écriture autorisée par les politiques |
| --- | --- | --- | --- |
| `profiles` | Oui | Tous les utilisateurs authentifiés | Création et modification de son propre profil (`auth.uid() = id`) |
| `games` | Oui | Ses propres résultats | Insertion de ses propres résultats |
| `game_rooms` | Oui | Salles dont on est hôte ou invité | Insertion avec son identifiant comme hôte |

Les profils contiennent `id`, `username`, `avatar`, `created_at`, sans e-mail.
Un index unique sur `lower(username)` impose l'unicité du pseudo, sans distinction
de casse. Correction du constat initial, qui n'avait examiné que les contraintes
de table et pas les index. Le trigger de création de compte exige un pseudo
dans les métadonnées ; l'inscription locale le transmet maintenant avec l'avatar `robot`.

Les fonctions de salle existantes vérifient session, participants, tour, cases
et fin de manche. Les mutations utilisent un verrou de ligne. Cette base reste
à tester pendant l'itération multijoueur.

## Points de sécurité à traiter

- L'insertion de `games` permet à un joueur d'envoyer son propre résultat.
  Avant le classement, prévoir des résultats produits par la logique serveur.
- `create_profile_for_new_user()` est une fonction trigger `SECURITY DEFINER`
  dont l'exécution est accordée aux rôles clients. Prévoir une migration pour
  restreindre ces droits. Une fonction trigger ne s'appelle normalement pas comme
  une fonction ordinaire ; l'avertissement seul ne prouve pas une exploitation.
- Les RPC de salle `SECURITY DEFINER` sont aussi signalées pour le rôle
  authentifié. Leur exécution est attendue ; tester leurs contrôles internes.
- Les privilèges clients sur les tables incluent `TRUNCATE`. RLS ne protège pas
  cette opération PostgreSQL : prévoir une restriction aux privilèges nécessaires.
  Aucune opération destructive n'a été tentée.
- Protection des mots de passe compromis désactivée selon le conseiller.
  Depuis la demande de Thomas de l'itération 13, l'application utilise un mot de
  passe ; cette protection serveur reste à examiner. Aucun paramètre distant changé.

Références : [RLS et ses limites](https://supabase.com/docs/guides/database/postgres/row-level-security),
[fonction exposée au rôle anonyme](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable),
[fonctions exposées au rôle authentifié](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).

## Vérifications et limites

- REST avec clé publique sans session : HTTP 200, aucun profil retourné malgré
  un profil existant. Aucun contenu du profil existant n'a été consulté.
- Contraintes, politiques, fonctions et trigger inspectés.
- Isolation des écritures vérifiée localement avec deux identités simulées sous
  PostgreSQL/PGlite, après application de la migration de restriction locale.
  Vérification sur Supabase avec deux comptes réels encore à effectuer.
- Redirections et templates e-mail à inspecter.
- Migration de restriction appliquée sur Supabase après validation, sous la version
  `20261106142024` attribuée par le service. Fichier local renommé pour correspondre.
  Le tableau initial ci-dessus décrit l'état avant cette migration.
- Contrôles distants des privilèges : aucune lecture anonyme des profils, édition
  du pseudo autorisée mais pas de l'identifiant ou de la date, insertion des
  résultats et des scores de salle refusée, TRUNCATE et exécution directe du trigger
  retirés. Les colonnes des options de salle restent inscriptibles.
- Conseiller relancé : avertissement du trigger disparu ; restent les quatre RPC
  SECURITY DEFINER destinées aux utilisateurs connectés et la protection des mots
  de passe compromis désactivée. Aucun paramètre Auth modifié à cette livraison.
