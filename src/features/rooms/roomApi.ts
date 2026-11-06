import { supabase } from '../../lib/supabase'
import type { Room, RoomAction, RoomOptions } from './rooms'

function client() {
  if (!supabase) throw new Error('Connexion indisponible.')
  return supabase
}

export async function createRoom(options: RoomOptions, requestId: string) {
  const { data, error } = await client().rpc('create_friend_room', {
    p_request_id: requestId, p_visibility: options.visibility, p_round_count: options.rounds,
    p_host_symbol: options.symbol, p_turn_duration: options.duration,
  })
  if (error) throw error
  return data as string
}

export async function joinRoom(code: string) {
  const { data, error } = await client().rpc('join_game_room', { p_invite_code: code })
  if (error) throw error
  return data as string
}

export async function readRoom(id: string, signal?: AbortSignal) {
  const query = client().from('game_rooms').select('*').eq('id', id)
  const { data, error } = await (signal ? query.abortSignal(signal) : query).maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Salle introuvable ou accès refusé.')
  return data as Room
}

export async function roomAction(room: Room, action: RoomAction, cell?: number) {
  const { error } = await client().rpc('friend_room_action', {
    p_room_id: room.id, p_action: action, p_round: room.current_round,
    p_series: room.series_number, p_cell: cell ?? null,
  })
  if (error) throw error
}

// Seules les erreurs métier prévues sont affichées ; aucune erreur SQL brute.
const messages = [
  'Salle introuvable.', 'Salle introuvable ou accès refusé.', 'Cette salle est complète.',
  'Cette salle ne peut plus être rejointe.', 'Ce n’est pas ton tour.',
  'Cette case est déjà occupée.', 'Cette manche ne peut pas être jouée.',
  'La partie a changé. Actualise son état.', 'La partie a déjà démarré.',
  'Complète ton profil avant de créer une partie.',
]
export function roomError(error: unknown) {
  const message = error && typeof error === 'object' && 'message' in error ? error.message : null
  if (typeof message === 'string' && messages.includes(message)) return message
  return 'Action impossible. Vérifie ta connexion et réessaie.'
}
