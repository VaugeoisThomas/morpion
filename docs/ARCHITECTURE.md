# Se repérer dans le projet

Commencer dans `features/game` pour le jeu, `features/profile` pour le profil
et `features/auth` pour la connexion.

## Les trois zones de code

| Dossier | Rôle |
|---|---|
| `src/app` | Routes, navigation, fond, styles globaux et mise en page. |
| `src/features` | Fonctionnalités : accueil, authentification, profil et jeu. |
| `src/shared` | Composants génériques et client Supabase partagés. |

`src/main.tsx` monte React. `app/router.tsx` associe les URL aux pages et
`app/routes.ts` centralise les chemins.

## Organisation d’une fonctionnalité

```text
features/game/
  pages/
    ComputerGame/                  # Partie contre l’ordinateur
    CreateGame/                    # Création de salle
    JoinGame/                      # Rejoindre une salle
    GameRoom/                      # Attente et partie multijoueur
  components/
    GameBoard/
      GameBoard.tsx
      GameBoard.css
      GameBoard.test.tsx
    GameSymbol/
      GameSymbol.tsx
      GameSymbol.css
    ...
  hooks/                           # État React et actions de l’interface
  data/                            # Accès Supabase
  model/                           # Types, règles et tests des fonctions pures
```

Chaque page et chaque composant possède son dossier nommé en PascalCase.
Le code, les styles et les tests éventuels restent ensemble. Cette convention
s’applique aussi au profil, à l’authentification et aux composants génériques.
L’accueil se trouve dans `features/home/pages/Home` ; le profil dans
`features/profile/pages/Profile`.

Les dossiers `app/layout`, `app/navigation` et `app/background` regroupent déjà
chacun une responsabilité commune au site. Ils restent plats.

## Où ajouter un fichier ?

| Besoin | Emplacement |
|---|---|
| Écran associé à une route | `features/<fonctionnalité>/pages/<Page>/` |
| Composant propre au jeu ou au profil | `features/<fonctionnalité>/components/<Composant>/` |
| Contrôle réutilisable sans logique métier | `shared/ui/<Composant>/` |
| État React ou effets | `features/<fonctionnalité>/hooks/` |
| Règles du jeu et types | `features/game/model/` |
| Requête Supabase | `features/<fonctionnalité>/data/` |
| Validation du pseudo | `features/profile/utils/username.ts` |
| Contexte d’authentification | `features/auth/context/` |

Les hooks portent le nom de la fonction exportée : `useCopyGameCode.ts`, par
exemple. `AuthProvider.tsx` fournit le contexte défini dans `auth-context.ts`.
Un composant reste dans sa fonctionnalité même si une autre l’utilise : le résumé
du compte dans le menu appartient ainsi au profil.

## Imports, styles et tests

- Importer directement le fichier, par exemple `components/GameBoard/GameBoard`.
- Garder les imports relatifs sans fichiers `index.ts` de réexport.
- La page gère le placement ; le composant gère ses styles internes, en BEM et mobile first.
- Placer `Nom.test.ts` ou `Nom.test.tsx` près du fichier testé.
- Regrouper les tests par fonction ou composant avec `describe`.
- Extraire les données réellement répétées dans des fonctions de préparation qui
  créent un nouvel objet à chaque appel.
- Marquer un exercice non implémenté avec `test.todo` plutôt que laisser un fichier vide.

## Hors du code source

| Dossier | Contenu |
|---|---|
| `public/avatars` | Images des avatars. |
| `public/figma` | Assets SVG du design. |
| `public/fonts` | Police locale et sa licence. |
| `supabase/migrations` | Migrations SQL versionnées ; conserver les noms et l’ordre. |
| `.github/workflows` | Vérifications automatiques du dépôt. |
| `docs` | Guides du projet. |
| `dist`, `node_modules` | Dossiers générés, exclus de Git. |

## Guides complémentaires

- [Cycle de développement](DEVELOPMENT.md)
- [Imports](IMPORTS.md)
- [CSS mobile first](RESPONSIVE.md)
- [Avatars](AVATARS.md)
- [Ancien et nouvel emplacement des fichiers](FILE_MOVES.md)
