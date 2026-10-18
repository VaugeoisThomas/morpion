# Morpion

Jeu de morpion en React et TypeScript, construit avec Vite et Supabase.

Le projet propose des parties contre l’ordinateur, des salles multijoueurs
actualisées en temps réel, des profils avec avatars et un historique des parties.
Le classement et les paramètres sont encore en développement.

## Installation

Utiliser Node.js 24 LTS et npm.

```bash
npm ci
```

Créer un fichier `.env.local` à la racine avec les valeurs de son projet Supabase :

```dotenv
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=votre-cle-publiable
```

Utiliser uniquement la clé publiable destinée au navigateur, jamais une clé
`service_role` ou une clé secrète. Les fichiers d’environnement ne sont pas versionnés.

Pour une nouvelle base, installer les migrations du dossier `supabase/migrations`
dans leur ordre chronologique. Avec la CLI Supabase, se connecter, lier le projet,
puis vérifier les migrations avant de les appliquer :

```bash
npx supabase login
npx supabase link --project-ref VOTRE_REFERENCE_PROJET
npx supabase db push --dry-run
npx supabase db push
```

Configurer également les URL de redirection de l’authentification dans Supabase
pour l’adresse locale et, le cas échéant, le site déployé.

```bash
npm run dev
```

## Commandes

- `npm run dev` démarre le serveur de développement.
- `npm run lint` vérifie le code avec ESLint.
- `npm run build` vérifie les types TypeScript puis construit l’application.
- `npm run preview` sert localement la dernière version construite.
- `npm run test` lance Vitest en surveillance avec un affichage détaillé.
- `npm run test -- --run` exécute tous les tests une seule fois.

## Vérifications

Les tests unitaires couvrent les règles du morpion, la stratégie de l’ordinateur
et les messages de la salle. Ils ne remplacent pas les essais du multijoueur avec
deux comptes ni la vérification visuelle des pages.

GitHub Actions exécute le lint, les tests et le build pour les propositions de
modification et les mises à jour de `main`. Le build de vérification utilise une
configuration Supabase fictive et ne déploie rien.

## Organisation

- `src/app` contient le routeur, les chemins, les styles globaux et le cadre du site.
- `src/features/home` contient l’accueil.
- `src/features/auth` contient l’authentification et son contexte React.
- `src/features/profile` contient le profil, ses formulaires et ses composants.
- `src/features/game` contient les parties, leurs options, leur historique et la logique du morpion.
- `src/shared/ui` contient les composants génériques, comme `Button` et `RadioChoice`.
- `src/shared/lib` contient le client Supabase.

Chaque composant et chaque page de fonctionnalité possède son sous-dossier avec
ses styles et ses tests éventuels. Les hooks, données et règles restent regroupés
par rôle dans leur fonctionnalité.

Le classement est encore provisoire. L’historique des parties est chargé depuis Supabase.

Le [guide de l’arborescence](docs/ARCHITECTURE.md) explique où chercher chaque fichier et comment ranger les prochains composants.

Le [cycle de développement](docs/DEVELOPMENT.md) décrit les branches, les commits,
les vérifications et la revue des pull requests.

La [convention des imports](docs/IMPORTS.md) explique leur ordre et leur correction automatique dans VS Code.

Le [guide responsive](docs/RESPONSIVE.md) décrit l’approche mobile first et les seuils utilisés dans les styles.
