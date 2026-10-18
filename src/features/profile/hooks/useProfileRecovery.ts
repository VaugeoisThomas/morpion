import { useState } from "react";

import { supabase } from "../../../shared/lib/supabase";
import { useAuth } from "../../auth/hooks/useAuth";
import { validateUsername } from "../utils/username";

import type { AvatarId } from "../data/profile";

/**
 * Données nécessaires pour initialiser le formulaire de création du profil. Contient l’identifiant
 * de l’utilisateur connecté, le pseudo initial et l’avatar initial.
 */

interface UseProfileRecoveryOptions {
  userId: string;
  initialUsername: string;
  initialAvatar: AvatarId;
}

/**
 * Gère la création d’un profil manquant pour un utilisateur connecté. Initialise les champs avec
 * le pseudo et l’avatar fournis.
 *
 * @param userId - Identifiant de l’utilisateur auquel associer le profil.
 * @param initialUsername - Pseudo utilisé pour initialiser le formulaire.
 * @param initialAvatar - Avatar utilisé pour initialiser le formulaire.
 * @returns Les champs, leurs fonctions de modification, les états du formulaire et les actions de
 * création et de déconnexion.
 */
export function useProfileRecovery({
  userId,
  initialUsername,
  initialAvatar,
}: UseProfileRecoveryOptions) {
  const { refreshProfile } = useAuth();
  const [username, setUsername] = useState(initialUsername);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Indique si le pseudo, après suppression des espaces aux extrémités, contient entre 3 et 16
   * caractères : lettres ASCII, chiffres ou "_". Utilisé par l’interface pour valider le champ. Ne
   * bloque pas directement la création dans createProfile.
   */
  const isValidUsername = validateUsername(username);

  /**
   * Crée le profil dans Supabase, puis recharge le profil partagé. Empêche la soumission HTML par
   * défaut et efface l’ancienne erreur. Une erreur de rechargement peut survenir alors que le
   * profil a déjà été créé en base.
   *
   * @param event - Événement de soumission du formulaire.
   * @returns Une promesse résolue après le traitement de la création.
   * @todo Vérifier la validité du pseudo avant l’insertion.
   * @todo Refuser une nouvelle soumission lorsqu’une requête est en cours.
   * @todo Distinguer un pseudo déjà utilisé d’un profil déjà existant dans le traitement des
   * erreurs d’unicité.
   */
  async function createProfile(event: { preventDefault: () => void }) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.from("profiles").insert({
        id: userId,
        username: username.trim(),
        avatar: selectedAvatar,
      });

      if (error) {
        setErrorMessage(
          error.code === "23505"
            ? "Ce pseudo est déjà utilisé. Choisis-en un autre."
            : error.message,
        );
        return;
      }

      await refreshProfile();
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
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setErrorMessage(error.message);
  }

  return {
    username,
    setUsername,
    selectedAvatar,
    setSelectedAvatar,
    isSubmitting,
    errorMessage,
    isValidUsername,
    createProfile,
    signOut,
  };
}
