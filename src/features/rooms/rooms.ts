import type { Board, Symbol } from '../game/game'

export type RoomOptions = { visibility: 'private' | 'public'; rounds: 1 | 3 | 5; symbol: Symbol; duration: 15 | 30 | 60 }
export type Room = {
  id: string; host_id: string; guest_id: string | null; invite_code: string;
  visibility: RoomOptions['visibility']; round_count: RoomOptions['rounds'];
  host_symbol: Symbol; turn_duration: RoomOptions['duration'];
  status: 'waiting' | 'in_progress' | 'finished' | 'cancelled'; board: Board;
  current_turn: Symbol; current_round: number; host_score: number; guest_score: number;
  turn_started_at: string | null; round_finished: boolean; round_winner: Symbol | null;
  round_end_reason: 'alignment' | 'draw' | 'timeout' | null; series_number: number;
  host_replay_ready: boolean; guest_replay_ready: boolean;
}
export type RoomAction = 'start' | 'next' | 'move' | 'expire' | 'replay' | 'leave'

export function formatInviteCode(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
  return compact.length > 4 ? `${compact.slice(0, 4)}-${compact.slice(4)}` : compact
}

export function isInviteCode(value: string) { return /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(value) }

export function invitationUrl(currentUrl: string, code: string) {
  const url = new URL(currentUrl)
  url.search = ''
  url.hash = `/rejoindre/${code}`
  return url.toString()
}

export function roomSecondsLeft(room: Room, now: number) {
  if (!room.turn_started_at || room.round_finished || room.status !== 'in_progress') return null
  return Math.max(0, Math.ceil((Date.parse(room.turn_started_at) + room.turn_duration * 1000 - now) / 1000))
}
