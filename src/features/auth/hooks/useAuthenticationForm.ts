import { useState } from "react";

import { paths } from "../../../app/routes";
import { supabase } from "../../../shared/lib/supabase";
import { validateUsername } from "../../profile/utils/username";

import type { AvatarId } from "../../profile/data/profile";

type AuthMode = "signup" | "login";

/**
 * Gère le formulaire d'inscription et de connexion avec Supabase. Centralise les champs, le mode
 * du formulaire, l'état de soumission et les messages de succès ou d'erreur A l'inscription,
 * transmet le pseudo, l'avatar dans les métadonnées du compte.
 *
 * @returns Les valeurs des champs, leurs fonctions de modification, les états du formulaire et les
 * actions de soumission et de changement de mode.
 */

export function useAuthenticationForm() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>("robot");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Indique si le pseudo, après suppression des espaces aux extrémités, contient entre 3 et 16
   * caractères: lettres ASCII, chiffre ou "_". Cette valeur sert à la validation dans l'interface.
   */
  const isValidUsername = validateUsername(username);

  let submitLabel = "Me connecter";
  if (isSubmitting) submitLabel = "Patiente...";
  else if (mode === "signup") submitLabel = "Créer mon compte";

  /**
   * Soumet le formulaire selon le mode séléctionné. En mode inscription, crée un compte avec le
   * pseudo et l'avatar.
   *
   * @param e - Evenement dont le comportement de soumission par défaut doit être empêché.
   * @returns Une promesse résolue après le traitement de soumission.
   * @todo Vérifier la validité du pseudo avant l'appel d'inscription.
   * @todo Refuser une nouvelle soumission lorsqu'une requête est en cours.
   */
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { username: username.trim(), avatar: selectedAvatar },
            emailRedirectTo: `${window.location.origin}${paths.profile}`,
          },
        });
        if (error) throw error;
        setMessage(
          data.session
            ? "Compte crée. Tu es connecté."
            : "Compte crée. Consulte tes emails pour confirmer ton adresse.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setMessage("Connexion réussie.");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /** Bascule les modes d'inscription et de connexion. Efface les messages de succès et d'erreur. */
  function switchMode() {
    setMode((currentMode) => (currentMode === "signup" ? "login" : "signup"));
    setMessage("");
    setErrorMessage("");
  }

  return {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    selectedAvatar,
    setSelectedAvatar,
    isSubmitting,
    message,
    errorMessage,
    isValidUsername,
    submitLabel,
    handleSubmit,
    switchMode,
  };
}
