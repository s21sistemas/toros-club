import { create } from 'zustand'
import { toast } from 'sonner'
import {
  createProveedor,
  getProveedores,
  removeProveedor,
  updateProveedor
} from '../api/proveedores'

let unsubscribe = null
export const useProveedorStore = create((set, get) => ({
  proveedores: [],
  loading: false,

  getDataProveedor: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getProveedores((data) => {
            set({ proveedores: data })
            resolve(data)
          })
        } else {
          resolve(get().proveedores)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addProveedor: async (data) => {
    const promise = async () => {
      try {
        await createProveedor(data)
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

  editProveedor: async (data) => {
    const promise = async () => {
      try {
        await updateProveedor(data.id, data)
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

  deleteProveedor: async (id) => {
    const promise = async () => {
      try {
        await removeProveedor(id)
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
