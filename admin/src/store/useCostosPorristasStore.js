import { create } from 'zustand'
import {
  createCostoPorrista,
  getCostoPorrista,
  removeCostoPorrista,
  updateCostoPorrista
} from '../api/costos-porrista'
import { toast } from 'sonner'

let unsubscribe = null
export const useCostosPorristasStore = create((set, get) => ({
  costos: [],
  loading: false,

  getDataCostoPorrista: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getCostoPorrista((data) => {
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

  addCostoPorrista: async (data) => {
    const promise = async () => {
      try {
        await createCostoPorrista(data)
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

  editCostoPorrista: async (data) => {
    const promise = async () => {
      try {
        await updateCostoPorrista(data.id, data)
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

  deleteCostoPorrista: async (id) => {
    const promise = async () => {
      try {
        await removeCostoPorrista(id)
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
