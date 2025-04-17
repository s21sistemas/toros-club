import { create } from 'zustand'
import {
  createCategoria,
  getCategoria,
  removeCategoria,
  updateCategoria
} from '../api/categorias'
import { toast } from 'sonner'

let unsubscribe = null
export const useCategoriaStore = create((set, get) => ({
  categorias: [],
  loading: false,

  getDataCategorias: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getCategoria((data) => {
            set({ categorias: data })
            resolve(data)
          })
        } else {
          resolve(get().categorias)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addCategoria: async (data) => {
    const promise = async () => {
      try {
        await createCategoria(data)
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

  editCategoria: async (data) => {
    const promise = async () => {
      try {
        await updateCategoria(data.id, data)
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

  deleteCategoria: async (id) => {
    const promise = async () => {
      try {
        await removeCategoria(id)
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
