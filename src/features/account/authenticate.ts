import type { SupabaseClient } from '@supabase/supabase-js'

type AuthApi = Pick<SupabaseClient['auth'], 'signUp' | 'signInWithPassword'>
type Credentials = { email: string; password: string }
type Registration = { username: string; redirectUrl: string }

export function authenticate(auth: AuthApi, credentials: Credentials, registration?: Registration) {
  const email = credentials.email.trim()
  if (registration) {
    return auth.signUp({
      email, password: credentials.password,
      options: {
        emailRedirectTo: registration.redirectUrl,
        data: { username: registration.username.trim(), avatar: 'robot' },
      },
    })
  }
  return auth.signInWithPassword({ email, password: credentials.password })
}
