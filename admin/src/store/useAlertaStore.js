import { create } from 'zustand'
import { createAlerta, getAlerta, removeAlerta } from '../api/alertas'
import { toast } from 'sonner'

let unsubscribe = null
export const useAlertaStore = create((set, get) => ({
  alertas: [],
  loading: false,

  getDataAlerta: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getAlerta((data) => {
            set({ alertas: data })
            resolve(data)
          })
        } else {
          resolve(get().alertas)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addAlerta: async (data) => {
    try {
      await createAlerta(data)
    } catch (error) {
      console.error(error)
      throw new Error('Ah ocurrido un error')
    }
  },

  deleteAlerta: async (id) => {
    const promise = async () => {
      try {
        await removeAlerta(id)
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
