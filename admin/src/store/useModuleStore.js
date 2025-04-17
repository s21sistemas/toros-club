import { create } from 'zustand'
import {
  createModule,
  getModules,
  removeModule,
  updateModule
} from '../api/modules'
import { toast } from 'sonner'

let unsubscribe = null
export const useModuleStore = create((set, get) => ({
  modules: [],
  loading: false,

  getDataModules: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getModules((data) => {
            set({ modules: data })
            resolve(data)
          })
        } else {
          resolve(get().modules)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addModule: async (data) => {
    const promise = async () => {
      try {
        await createModule(data)
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

  editModule: async (data) => {
    const promise = async () => {
      try {
        await updateModule(data.id, data)
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

  deleteModule: async (id) => {
    const promise = async () => {
      try {
        await removeModule(id)
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
