import { create } from 'zustand'
import {
  getOrdenCompras,
  createOrdenCompra,
  updateOrdenCompra,
  removeOrdenCompra
} from '../api/ordenes_compra'
import { toast } from 'sonner'

let unsubscribe = null
export const useOrdenCompraStore = create((set, get) => ({
  ordenCompras: [],
  loading: false,

  getDataOrdenCompras: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getOrdenCompras((data) => {
            set({ ordenCompras: data })
            resolve(data)
          })
        } else {
          resolve(get().ordenCompras)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addOrdenCompra: async (data) => {
    const promise = async () => {
      try {
        await createOrdenCompra(data)
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

  editOrdenCompra: async (data) => {
    const promise = async () => {
      try {
        await updateOrdenCompra(data.id, data)
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

  deleteOrdenCompra: async (id) => {
    const promise = async () => {
      try {
        await removeOrdenCompra(id)
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
