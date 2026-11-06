# Connexion par e-mail et mot de passe

Projet choisi : `maxvfzqcfglvulcmyrnz`.

## Configuration locale

Le fichier `.env` a été créé à la racine avec l'URL du projet et sa clé publique,
retrouvées dans la sauvegarde et vérifiées comme appartenant à ce même projet.
Il est ignoré par Git. `.env.example` contient le modèle sans clé.

Variables utilisées :

```dotenv
VITE_SUPABASE_URL=https://maxvfzqcfglvulcmyrnz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=
```

La variable de clé accepte la clé publique publishable ou la clé historique anon.
La clé récupérée est une clé publique anon ; aucune clé service_role n'est utilisée.
Après une modification de `.env`, relancer `npm run dev`.

## Configuration distante à vérifier

Dans Supabase, Authentication → URL Configuration, autoriser les URL de retour
utilisées pour le développement et, plus tard, le domaine de production :

- `http://127.0.0.1:5173/`
- `http://localhost:5173/`

L'application utilise la route `#/compte` sur la même URL. Vérifier également
le template de l'e-mail : il doit envoyer le lien de confirmation Supabase,
pas seulement un code OTP. Aucune modification distante n'a encore été effectuée.

L'API publique du projet a confirmé le 6 novembre 2026 : connexion e-mail activée,
inscriptions autorisées et confirmation e-mail requise.

## Parcours développé

1. Ouvrir `#/compte` via « Se connecter » dans la navigation.
2. Pour un compte existant, saisir son adresse e-mail et son mot de passe.
   Aucun e-mail de connexion n'est demandé. Pour une inscription, sélectionner
   « Créer un compte », saisir un pseudo, une adresse e-mail et un mot de passe
   d'au moins 8 caractères, puis confirmer ce dernier.
   Le pseudo est transmis dans les métadonnées de création : le trigger existant
   `on_auth_user_created_profile` en a besoin pour créer le profil.
3. À la création uniquement, ouvrir le lien de confirmation reçu dans le même
   navigateur. Supabase confirme l'adresse et peut ouvrir une session. Les
   connexions suivantes utilisent directement l'e-mail et le mot de passe.
4. Modifier son pseudo et choisir son avatar, puis enregistrer. Le profil est lu
   et écrit dans `public.profiles` avec la session du joueur et les règles RLS.
   Un profil absent peut être créé depuis ce même formulaire.
5. « Se déconnecter » termine la session de ce navigateur.

Le navigateur utilisé pour l'inscription conserve le vérificateur PKCE : ouvrir
le lien de confirmation dans ce même navigateur. Un délai local de 60 secondes
limite les nouvelles tentatives d'inscription après une demande acceptée.
Ce délai ne bloque pas la connexion par mot de passe. Les mots de passe ne sont
ni journalisés ni enregistrés par le code applicatif ; Supabase gère leur stockage.
Ils sont effacés de l'état du formulaire après réussite ou changement de mode.

Le parcours « Créer un compte » propose également de renvoyer la confirmation
d'une inscription existante, avec l'API `auth.resend({ type: 'signup' })`.
Cette action exige une adresse valide et respecte le délai de 60 secondes.
Elle n'est pas proposée dans le parcours de connexion par mot de passe.

## Limites de cette étape

- Parcours réel d'inscription et de connexion effectué et validé par Thomas,
  confirmation reçue le 6 novembre 2026. Aucun e-mail de test envoyé par l'agent.
- Le renvoi de confirmation d'inscription ajouté ensuite reste à vérifier en réel.
- Formulaires de connexion et d'inscription inspectés visuellement sur desktop.
  Profil connecté et conformité exacte à la maquette du profil restent à vérifier.
- Schéma et politiques inspectés via MCP le 6 novembre 2026 : voir
  [l'inspection Supabase](supabase-inspection.md). Migration de restriction des droits
  appliquée sur validation de Thomas, puis privilèges distants vérifiés.
- L'enregistrement réel reste à tester. L'isolation des écritures est testée
  localement avec PostgreSQL/PGlite et deux identités simulées. La migration
  durcissant les droits est appliquée à Supabase ; les droits de table et de colonne
  ont été vérifiés sur le projet distant. L'accès anonyme aux profils est retiré.
- Les modes en ligne restent désactivés. Leur future implémentation devra imposer
  l'authentification côté Supabase ; la seule présence d'une session dans React
  ne remplace pas les politiques de sécurité de la base.
- La création de compte passe par `signUp`, la connexion par `signInWithPassword`.
  Aucun appel `signInWithOtp` n'est utilisé dans l'application.
- Thomas confirme qu'aucun compte sans mot de passe n'est à conserver : aucune
  migration de compte ou réinitialisation de mot de passe ajoutée à cette itération.
- Le pseudo accepte 3 à 16 lettres ASCII, chiffres ou underscores, conformément
  à la contrainte existante. Un index impose son unicité sans distinction de casse.
- Les dix avatars SVG viennent de la sauvegarde et correspondent aux identifiants
  autorisés par `profiles_avatar_check`.

## Sources techniques

- https://supabase.com/docs/reference/javascript/auth-signup
- https://supabase.com/docs/reference/javascript/auth-signinwithpassword
- https://supabase.com/docs/reference/javascript/auth-resend
- https://supabase.com/docs/guides/auth/sessions/pkce-flow
- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/reference/javascript/auth-onauthstatechange
