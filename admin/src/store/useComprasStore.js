import { create } from 'zustand'
import {
  createCompra,
  getCompras,
  removeCompra,
  updateCompra
} from '../api/compras'
import { toast } from 'sonner'

let unsubscribe = null
export const useComprasStore = create((set, get) => ({
  compras: [],
  loading: false,

  getDataCompras: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getCompras((data) => {
            set({ compras: data })
            resolve(data)
          })
        } else {
          resolve(get().compras)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addCompras: async (data) => {
    const promise = async () => {
      try {
        await createCompra(data)
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

  editCompras: async (data) => {
    const promise = async () => {
      try {
        await updateCompra(data.id, data)
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

  deleteCompras: async (id) => {
    const promise = async () => {
      try {
        await removeCompra(id)
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
