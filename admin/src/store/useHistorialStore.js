import { create } from 'zustand'
import { toast } from 'sonner'
import {
  getHistorial,
  removeHistorial,
  updateHistorial
} from '../api/historial'

let unsubscribe = null
export const useHistorialStore = create((set, get) => ({
  historial: [],
  loading: false,

  getDataHistorial: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getHistorial((data) => {
            set({ historial: data })
            resolve(data)
          })
        } else {
          resolve(get().historial)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  editHistorial: async (data) => {
    const promise = async () => {
      try {
        await updateHistorial(data.id, data)
      } catch (error) {
        console.error(error)
      }
    }

    toast.promise(promise(), {
      loading: 'Actualizando...',
      success: 'Actualizado correctamente',
      error: 'Falló al eliminar.'
    })
  },

  deleteHistorial: async (data) => {
    const promise = async () => {
      try {
        await removeHistorial(data)
      } catch (error) {
        console.error(error)
      }
    }

    toast.promise(promise(), {
      loading: 'Elimiando...',
      success: 'Eliminado correctamente',
      error: 'Falló al eliminar.'
    })
  }
}))
