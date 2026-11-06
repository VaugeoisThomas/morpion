import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { readRoom, roomError } from './roomApi'
import type { Room } from './rooms'

export function useRoom(id: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const refreshRef = useRef<(() => Promise<void>) | null>(null)

  useEffect(() => {
    if (!supabase) return
    const abort = new AbortController()
    let sequence = 0
    async function refresh() {
      const request = ++sequence
      try {
        const next = await readRoom(id, abort.signal)
        if (!abort.signal.aborted && request === sequence) { setRoom(next); setError(null) }
      } catch (failure) {
        if (!abort.signal.aborted && request === sequence) setError(roomError(failure))
      }
    }
    refreshRef.current = refresh
    const channel = supabase.channel(`room:${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: `id=eq.${id}` }, () => void refresh())
      .subscribe((status) => {
        if (abort.signal.aborted) return
        setConnected(status === 'SUBSCRIBED')
        if (status === 'SUBSCRIBED') void refresh()
      })
    void refresh()
    // Réconciliation aussi après perte d'événement, retour d'onglet ou de réseau.
    const poll = window.setInterval(() => void refresh(), 5000)
    const resume = () => { if (!document.hidden) void refresh() }
    document.addEventListener('visibilitychange', resume)
    window.addEventListener('online', resume)
    return () => {
      abort.abort()
      refreshRef.current = null
      window.clearInterval(poll)
      document.removeEventListener('visibilitychange', resume)
      window.removeEventListener('online', resume)
      void supabase!.removeChannel(channel)
    }
  }, [id])
  const refresh = useCallback(() => refreshRef.current?.(), [])
  return { room, error, connected, refresh }
}
