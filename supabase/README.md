# Schéma et sécurité Supabase

Projet existant : `maxvfzqcfglvulcmyrnz`.

## Migrations

Les douze migrations d'octobre 2026 proviennent des instructions enregistrées
dans `supabase_migrations.schema_migrations`, récupérées en lecture seule le
6 novembre. Leurs versions et noms sont conservés. Elles sont déjà appliquées
sur le projet : ne pas les rejouer ni réinitialiser la base distante.

L'historique n'est pas un dump exhaustif de configuration Supabase. Des droits
initiaux sont fournis par la plateforme et la politique de lecture des profils
distante a été restreinte depuis la première migration historique.

La nouvelle migration `20261106142024_restrict_client_permissions.sql` :

- réserve la lecture des profils aux utilisateurs connectés ;
- autorise seulement la création de son profil et l'édition du pseudo/avatar ;
- retire aux clients l'écriture directe des résultats ;
- limite les colonnes de création des salles à leurs options ;
- retire les privilèges inutiles, notamment `TRUNCATE`, des trois tables ;
- retire l'exécution directe de la fonction trigger aux clients.

Elle conserve les politiques de propriété et les RPC existantes. Les résultats
devront ensuite être produits par le serveur, à l'itération des scores.
Cette migration a été appliquée sur Supabase le 6 novembre 2026 après validation
de Thomas. L'API MCP a accepté l'écriture ; sa capacité réelle n'était donc plus
limitée à la lecture. Le nom local reprend la version attribuée par Supabase pour
éviter un second passage de la même migration. Les droits distants ont été vérifiés.

## Tests locaux

```sh
npm test
npm run test:db
```

`test:db` exécute les migrations sur PostgreSQL embarqué via PGlite, en mémoire.
Le test recrée les rôles `anon` et `authenticated`, un schéma Auth minimal,
`auth.uid()` et les privilèges de table initiaux de Supabase. Deux identités
fictives vérifient les restrictions et les RPC. Aucun secret `.env`, réseau,
compte réel ni donnée distante n'est utilisé.

Cela teste les véritables politiques PostgreSQL et privilèges, mais pas le
service Auth, le SMTP, PostgREST, les connexions simultanées ou les événements
Realtime. Ces parcours demandent encore des tests avec Supabase.

Source : [documentation officielle PGlite](https://pglite.dev/docs/).
