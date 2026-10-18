import { useState } from "react";

import { supabase } from "../../../shared/lib/supabase";
import { useAuth } from "../../auth/hooks/useAuth";
import { type SavedProfile,updateProfile } from "../data/profile";
import { validateUsername } from "../utils/username";

/**
 * Données nécessaires pour initialiser l'éditeur de profil. Contient le profil initial et
 * l'identifiant de l'utilisateur dont les modifications seront enregistrées.
 */

interface UseProfileEditorOptions {
  profile: SavedProfile;
  userId: string;
}

/**
 * Gère les champs et les actions du formulaire de modifications du profil. Après l'enregistrement,
 * recharge le profil dans le contexte d'autentification pour actualiser les composants qui
 * l'utilisent.
 *
 * @param Profil - Profil initial pour initialisé les champs.
 * @param userId - Identifiantde l'utilisateur dont le profil est modifié.
 * @returns Les champs, leurs fonctions de modification, les états du formulaire et les actions
 * d'enregistrement et de déconnexion.
 */
export function useProfileEditor({ profile, userId }: UseProfileEditorOptions) {
  const { refreshProfile } = useAuth();
  const [username, setUsername] = useState(profile.username);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Indique si le pseudo, après suppression des espaces aux extrémités contient entre 3 et 16
   * caractères: lettres ASCII, chiffres ou "_". Utilisé par l'interface pour valider le champs. Ne
   * bloque pas directement l'enregistrement dans handleSubmit.
   */
  const isValidUsername = validateUsername(username);

  /**
   * Enregistre le pseudo et l’avatar, puis recharge le profil partagé. Empêche la soumission HTML
   * par défaut et efface les anciens messages. Une erreur de rechargement peut survenir alors que
   * la modification a déjà été enregistrée en base.
   *
   * @param e - Événement de soumission du formulaire.
   * @returns Une promesse résolue après le traitement de la soumission.
   * @todo Vérifier la validité du pseudo avant l’enregistrement.
   * @todo Refuser une nouvelle soumission lorsqu’une requête est en cours.
   */
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      await updateProfile(userId, { username, avatar: selectedAvatar });
      await refreshProfile();
      setMessage("Profil enregitré.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Demande à Supabase de fermer la session de l’utilisateur. Affiche le message d’erreur si
   * Supabase signale un échec.
   *
   * @returns Une promesse résolue après le traitement de la déconnexion.
   */
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setErrorMessage(error.message);
  }

  return {
    username,
    setUsername,
    selectedAvatar,
    setSelectedAvatar,
    message,
    errorMessage,
    isSubmitting,
    isValidUsername,
    handleSubmit,
    handleSignOut,
  };
}
