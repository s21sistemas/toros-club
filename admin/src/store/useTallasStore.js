import { create } from 'zustand'
import { createTalla, getTalla, removeTalla, updateTalla } from '../api/tallas'
import { toast } from 'sonner'

let unsubscribe = null
export const useTallasStore = create((set, get) => ({
  tallas: [],
  loading: false,

  getDataTalla: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getTalla((data) => {
            set({ tallas: data })
            resolve(data)
          })
        } else {
          resolve(get().tallas)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addTalla: async (data) => {
    const promise = async () => {
      try {
        await createTalla(data)
      } catch (error) {
        console.error(error)
      }
    }

    toast.promise(promise(), {
      loading: 'Creando registro...',
      success: 'Registro creado correctamente',
      error: 'Falló al crear el registro.'
    })
  },

  editTalla: async (data) => {
    const promise = async () => {
      try {
        await updateTalla(data.id, data)
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

  deleteTalla: async (id) => {
    const promise = async () => {
      try {
        await removeTalla(id)
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
