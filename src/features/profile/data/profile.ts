import { supabase } from '../../../shared/lib/supabase'
import { type AvatarId,avatars } from './avatars'
export { avatars, type AvatarId } from './avatars'

/**
 * Profil affiché dans l’interface. Le statut « En ligne » est fixe et ne représente pas une
 * présence en temps réel.
 */
export interface SavedProfile {
  username: string
  avatar: AvatarId
  status: string
}

/**
 * Avatar de remplacement lorsqu'une valeur lue en base ne correspond à aucun avatar du catalogue.
 */
const DEFAULT_AVATAR = avatars[0]

/**
 * Recherche le profil associé à un utilisateur dans Supabase. Remplace un identifiant d'avatar
 * inconnu par l'avatar par défaut et ajoute le status d'affichage "En ligne"
 *
 * @param userId - Identifiant de l'utilisateur dont le profil est recherché.
 * @returns Le profil trouvé, ou null si aucun profil accessible ne correspond à cet identifiant.
 * @throws Si la requete Supabase échoue.
 * @todo Remplacer le status fixe si une gestion de présence est ajoutée.
 */
export async function loadProfile(userId: string): Promise<SavedProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, avatar')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    username: data.username,
    avatar: avatars.find(({ id }) => id === data.avatar)?.id ?? DEFAULT_AVATAR.id,
    status: 'En ligne',
  }
}

/**
 * Met à jour le pseudo et l'avatar d'un profil dans Supabase. Supprime les espaces aux extrémités
 * du pseudo avant l'enregistrement.
 *
 * @param userId -Identifiant de l'utilisateur dont le profil est modifié.
 * @param profile - Nouveau pseudo et nouvel identifiant d'avatar.
 * @returns Une promesse résolue lorsque la requête se termine sans erreur.
 * @throws Si Supabase signale une erreur pendant la mise à jour.
 * @todo Vérifier qu'une ligne à effectivement été modifiée.
 */
export async function updateProfile(
  userId: string,
  profile: Pick<SavedProfile, 'username' | 'avatar'>,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ username: profile.username.trim(), avatar: profile.avatar })
    .eq('id', userId)

  if (error) throw error
}