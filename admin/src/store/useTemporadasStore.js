import { create } from 'zustand'
import {
  createTemporada,
  getTemporada,
  removeTemporada,
  updateTemporada
} from '../api/temporadas'
import { toast } from 'sonner'

let unsubscribe = null
export const useTemporadasStore = create((set, get) => ({
  temporadas: [],
  loading: false,

  getDataTemporadas: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getTemporada((data) => {
            set({ temporadas: data })
            resolve(data)
          })
        } else {
          resolve(get().temporadas)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addTemporada: async (data) => {
    const promise = async () => {
      try {
        await createTemporada(data)
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

  editTemporada: async (data) => {
    const promise = async () => {
      try {
        await updateTemporada(data.id, data)
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

  deleteTemporada: async (id) => {
    const promise = async () => {
      try {
        await removeTemporada(id)
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
