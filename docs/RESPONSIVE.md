# CSS mobile first

Les styles de base décrivent le rendu sur les petits écrans. Les media queries
`min-width` ajoutent ensuite les adaptations nécessaires lorsque l’espace augmente.
Les classes suivent la convention BEM et les couleurs communes utilisent les
variables de `src/app/App.css`.

## Exemple : le statut de la salle

Dans `src/features/game/components/GameRoomStatus.css`, le statut est disposé en
colonne par défaut : l’indicateur apparaît au-dessus du message. À partir de
601 pixels, une media query le dispose en ligne, augmente l’espacement supérieur
et la taille du texte.

```css
.game-room-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 12px;
}

@media (min-width: 601px) {
  .game-room-status {
    flex-direction: row;
    gap: 8px;
    font-size: 14px;
  }
}
```

Les propriétés non redéfinies restent actives. Il faut donc rétablir explicitement
une propriété mobile qui ne convient plus au desktop, par exemple
`flex-direction: row` ou `display: block` après un `display: none`.

## Seuils du projet

| À partir de | Adaptations existantes |
| --- | --- |
| 481 px | Formulaires, choix radio, résumé de l’hôte et espacement des pages |
| 601 px | Cartes des joueurs, panneau d’invitation, statut, statistiques et accueil |
| 701 px | Disposition à deux colonnes de la création de partie |
| 761 px | Panneaux de l’accueil côte à côte |
| 901 px | Barre latérale desktop et disposition du profil |
| 1440 px | Liens de navigation plus grands |

Ces seuils dépendent du contenu ; il n’est pas nécessaire de tous les employer
dans chaque composant. Dans une feuille, les règles de largeur sont classées
du plus petit seuil au plus grand.

## Distinctions utiles

- `max-width: 480px` sur un élément limite sa largeur : cela reste compatible
  avec une approche mobile first.
- Le `media="(max-width: 600px)"` d’un élément `source` choisit une image ;
  ce n’est pas l’organisation des styles CSS.
- `prefers-reduced-motion: reduce` dépend d’une préférence d’accessibilité,
  pas de la largeur. Les indicateurs restent immobiles dans ce cas.

## Vérification dans le navigateur

Contrôler les pages à 320 ou 375 px, puis juste avant et après les seuils qui les
concernent. Vérifier aussi un desktop large. Pour le menu, tester les états ouvert
et fermé ; pour les formulaires et les cartes, vérifier les textes longs, le focus
et les boutons désactivés. L’analyse du CSS et la compilation ne remplacent pas
cette vérification visuelle.
