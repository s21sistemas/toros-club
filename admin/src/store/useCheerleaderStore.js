import { create } from 'zustand'
import {
  createCheerleader,
  getCheerleaders,
  removeCheerleader,
  updateCheerleader
} from '../api/cheerleader'
import { toast } from 'sonner'

let unsubscribe = null
export const useCheerleaderStore = create((set, get) => ({
  cheerleader: [],
  cheerleadersCount: 0,
  loading: false,

  getDataCheerleaders: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getCheerleaders((data) => {
            set({ cheerleader: data, cheerleadersCount: data.length })
            resolve(data)
          })
        } else {
          resolve(get().cheerleader)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addCheerleader: async (data) => {
    try {
      await createCheerleader(data)
    } catch (error) {
      console.error(error)
    }
  },

  editCheerleader: async (data) => {
    try {
      await updateCheerleader(data.id, data)
    } catch (error) {
      console.error(error)
    }
  },

  deleteCheerleader: async (id) => {
    const promise = async () => {
      try {
        await removeCheerleader(id)
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
