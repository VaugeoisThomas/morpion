# Convention des imports

Il n’existe pas d’ordre obligatoire en React ou TypeScript. Le projet applique une convention commune, vérifiée par ESLint.

## Ordre

1. React et sa famille : react, react-dom, react-router-dom.
2. Les autres bibliothèques externes : lucide-react, Supabase, etc.
3. Les fichiers du projet : composants, hooks, données et chemins, triés par chemin.
4. Les imports servant uniquement au typage, avec import type.
5. Les feuilles CSS, en dernier, dans leur ordre relatif d’origine.

Chaque groupe est séparé par une ligne vide. Les imports et les noms entre accolades sont triés automatiquement. Les imports Node (node:…) et les imports d’initialisation sans liaison, hors CSS, disposent de groupes particuliers avant les autres imports ; ils ne sont actuellement pas employés dans les composants.

## Exemple

```tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { CirclePlus } from 'lucide-react'

import { paths } from '../../../../app/routes'
import Button from '../../../../shared/ui/Button/Button'
import { useGameRoom } from '../../hooks/useGameRoom'

import type { GameRoomStatus } from '../../model/gameRoom'

import './GameRoom.css'
```

Un type ne crée pas de valeur JavaScript à utiliser pendant l’exécution. Les imports exclusivement utilisés pour le typage sont donc séparés des imports de valeurs. Leurs chemins restent inchangés.

## Automatisation

- `npm run lint` signale les imports qui ne respectent pas la convention.
- `npm run lint:fix` applique les corrections automatiques ESLint, y compris le tri des imports.
- VS Code applique les corrections ESLint lors d’un enregistrement explicite, avec l’extension **ESLint** (dbaeumer.vscode-eslint). Elle est recommandée dans le projet.

Ne pas activer en parallèle une autre action de tri, telle que `source.organizeImports`, car elle peut imposer un ordre différent. Le formatage de l’indentation peut rester activé : il est distinct du tri des imports.

Les règles sont définies dans `eslint.config.js` avec `simple-import-sort/imports` et `@typescript-eslint/consistent-type-imports`. Les exports, les corps des fonctions et les JSDoc n’ont pas été réécrits pour cette harmonisation.
