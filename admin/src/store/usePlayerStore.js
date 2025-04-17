import { create } from 'zustand'
import {
  createPlayer,
  getPlayers,
  removePlayer,
  updatePlayer
} from '../api/players'
import { toast } from 'sonner'

let unsubscribe = null
export const usePlayerStore = create((set, get) => ({
  players: [],
  playersCount: 0,
  loading: false,

  getDataPlayers: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getPlayers((data) => {
            set({ players: data, playersCount: data.length })
            resolve(data)
          })
        } else {
          resolve(get().players)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addPlayer: async (data) => {
    try {
      await createPlayer(data)
    } catch (error) {
      console.error(error)
    }
  },

  editPlayer: async (data) => {
    try {
      await updatePlayer(data.id, data)
    } catch (error) {
      console.error(error)
    }
  },

  deletePlayer: async (id) => {
    const promise = async () => {
      try {
        await removePlayer(id)
      } catch (error) {
        console.error(error)
      }
    }

    toast.promise(promise(), {
      loading: 'Eliminando...',
      success: 'Eliminado correctamente',
      error: 'Falló al eliminar.'
    })
  }
}))
