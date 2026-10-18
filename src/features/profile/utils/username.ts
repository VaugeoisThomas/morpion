/**
 * Vérifie la validité d'un pseudo après suppression des espaces aux extrémités.
 *
 * @param username - Pseudo à vérifier
 * @returns true si le pseudo contient entre 3 et 16 caractères: lettres ASCII, chiffres ou
 * underscore.
 */

export function validateUsername(username: string): boolean {
  return /^\w{3,16}$/.test(username.trim());
}
