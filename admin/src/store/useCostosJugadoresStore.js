import { create } from 'zustand'
import {
  createCostoJugador,
  getCostoJugador,
  removeCostoJugador,
  updateCostoJugador
} from '../api/costos-jugador'
import { toast } from 'sonner'

let unsubscribe = null
export const useCostosJugadoresStore = create((set, get) => ({
  costos: [],
  loading: false,

  getDataCostoJugador: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getCostoJugador((data) => {
            set({ costos: data })
            resolve(data)
          })
        } else {
          resolve(get().costos)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addCostoJugador: async (data) => {
    const promise = async () => {
      try {
        await createCostoJugador(data)
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

  editCostoJugador: async (data) => {
    const promise = async () => {
      try {
        await updateCostoJugador(data.id, data)
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

  deleteCostoJugador: async (id) => {
    const promise = async () => {
      try {
        await removeCostoJugador(id)
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
