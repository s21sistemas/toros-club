import { create } from 'zustand'
import {
  createPeticionEliminacion,
  getPeticionEliminacion,
  removePeticionEliminacion,
  updatePeticionEliminacion
} from '../api/peticiones-eliminacion'
import { toast } from 'sonner'

let unsubscribe = null
export const usePeticionEliminacionStore = create((set, get) => ({
  peticionEliminacion: [],
  loading: false,

  getDataPeticionEliminacion: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getPeticionEliminacion((data) => {
            set({
              peticionEliminacion: data
            })
            resolve(data)
          })
        } else {
          resolve(get().peticionEliminacion)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addPeticionEliminacion: async (data) => {
    const promise = async () => {
      try {
        await createPeticionEliminacion(data)
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

  editPeticionEliminacion: async (data) => {
    const promise = async () => {
      try {
        await updatePeticionEliminacion(data.id, data)
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

  deletePeticionEliminacion: async (id) => {
    const promise = async () => {
      try {
        await removePeticionEliminacion(id)
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
