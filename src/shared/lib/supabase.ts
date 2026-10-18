import { createClient } from '@supabase/supabase-js'

/** URL du projet Supabase fournie par la configuration Vite. */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

/** Clé publiable du projet Supabase utilisée par le client navigateur. */
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

/**
 * Client Supabase partagé pour l’authentification et les requêtes vers la base de données. Créé
 * une seule fois lors de l’évaluation du module.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey)