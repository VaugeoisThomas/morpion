# Se repérer dans le projet

Le code est regroupé par fonctionnalité. Pour travailler sur le profil, commence dans `src/features/profile` ; pour une partie, dans `src/features/game`.

## Arborescence

```text
src/
├── main.tsx                     # Démarrage de React
├── app/
│   ├── App.tsx                  # Affichage du routeur
│   ├── App.css                  # Police, couleurs et styles globaux
│   ├── router.tsx               # Association des URL aux pages
│   ├── routes.ts                # Chemins utilisés par les liens
│   ├── layout/                  # AppLayout et sa grille
│   ├── navigation/              # Menu, liens et ouverture du menu mobile
│   ├── background/              # Fond commun à toutes les pages
│   └── pages/                   # PagePlaceholder : écrans provisoires
├── features/
│   ├── home/
│   │   ├── pages/               # Home.tsx et Home.css
│   │   └── data/                # Raccourcis de l’accueil
│   ├── auth/
│   │   ├── components/          # AuthenticationForm
│   │   ├── context/             # AuthProvider et définition du contexte
│   │   └── hooks/               # useAuth et useAuthenticationForm
│   ├── profile/
│   │   ├── pages/               # Page Profile et son CSS
│   │   ├── components/          # Éditeur, aperçu, avatar, résumé du compte…
│   │   ├── hooks/               # Modification et récupération du profil
│   │   ├── data/                # Catalogue d’avatars, types et accès aux profils
│   │   └── utils/               # Validation du pseudo
│   └── game/
│       ├── pages/
│       │   ├── ComputerGame/    # Partie contre l’ordinateur
│       │   ├── CreateGame/      # Création d’une partie
│       │   └── GameRoom/        # Salle d’attente
│       ├── components/          # Symboles, résultat, résumé de l’hôte…
│       ├── hooks/               # État des parties, création, copie et historique
│       ├── data/                # Lecture et enregistrement dans Supabase
│       └── model/               # Règles du morpion et types des salles
└── shared/
    ├── ui/
    │   ├── Button/              # Bouton d’action générique
    │   └── RadioChoice/         # Choix radio générique
    └── lib/                     # Client Supabase
```

## Où ranger un nouveau fichier ?

- **Une page complète** : dans `features/<fonctionnalité>/pages`.
- **Un élément d’interface lié au jeu ou au profil** : dans les `components` de cette fonctionnalité.
- **Un élément générique sans connaissance du jeu ou du compte** : dans `shared/ui`.
- **Une logique React avec état ou effets** : dans les `hooks` de la fonctionnalité.
- **Les règles du jeu sans React ni Supabase** : dans `features/game/model`.
- **Une requête Supabase** : dans le dossier `data` de la fonctionnalité.
- **Un changement du menu ou du fond commun** : dans `app`.

Les fichiers TSX et CSS d’un composant restent côte à côte. Les classes BEM et le rendu ne changent pas avec leur emplacement. La page conserve les styles de placement ; le composant conserve ses styles internes.

Un composant de profil utilisé dans le menu, comme `UserProfileSummary`, reste dans `features/profile/components` : son rôle concerne le compte, même si plusieurs pages l’affichent.

Les imports restent relatifs. `./` désigne le dossier courant et chaque `../` remonte d’un dossier. Les imports entre fonctionnalités sont possibles : l’accueil et le profil affichent par exemple l’historique fourni par `features/game`.

## Extraction en cours

`features/game/components/GameInvitationPanel.tsx` est le fichier préparé pour la prochaine extraction. Le panneau fonctionne encore dans `features/game/pages/CreateGame/CreateGame.tsx` : son extraction n’a pas été effectuée lors du rangement.

## Fichiers hors de src

- `public/figma` : SVG utilisés par l’interface ; leurs URL publiques restent inchangées.
- `public/fonts` : police Inter locale et sa licence.
- `supabase/migrations` : structure de la base de données et règles d’accès.
- `docs` : explications du projet et table des déplacements.
- Fichiers de configuration à la racine : Vite, TypeScript et ESLint.
- `dist` et `node_modules` : dossiers générés ; ne pas y modifier le code source.

Le [tableau des déplacements](FILE_MOVES.md) permet de retrouver un fichier à partir de son ancien chemin.

## Avatars

Le catalogue pixel art et le composant commun sont décrits dans le [guide des avatars](AVATARS.md), avec la migration nécessaire pour autoriser le tigre dans Supabase.
