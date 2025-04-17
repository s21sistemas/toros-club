import { create } from 'zustand'
import { toast } from 'sonner'
import {
  createArticulo,
  getArticuloById,
  getArticulos,
  removeArticulo,
  updateArticulo
} from '../api/articulos'

let unsubscribe = null
export const useArticuloStore = create((set, get) => ({
  articulos: [],
  loading: false,

  getArticulo: async (id) => {
    set({ loading: true })

    try {
      const res = await getArticuloById(id)

      return res
    } catch (error) {
      console.error(error)
    } finally {
      set({ loading: false })
    }
  },

  getDataArticulo: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getArticulos((data) => {
            set({ articulos: data })
            resolve(data)
          })
        } else {
          resolve(get().articulos)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addArticulo: async (data) => {
    const promise = async () => {
      try {
        const precio_compra = Number.parseFloat(data.precio_compra).toFixed(2)
        const precio_venta = Number.parseFloat(data.precio_venta).toFixed(2)
        const precio_reposicion = Number.parseFloat(
          data.precio_reposicion
        ).toFixed(2)

        const newData = {
          ...data,
          precio_compra,
          precio_venta,
          precio_reposicion
        }

        await createArticulo(newData)
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

  editArticulo: async (data) => {
    const promise = async () => {
      try {
        const precio_compra = Number.parseFloat(data.precio_compra).toFixed(2)
        const precio_venta = Number.parseFloat(data.precio_venta).toFixed(2)
        const precio_reposicion = Number.parseFloat(
          data.precio_reposicion
        ).toFixed(2)

        const newData = {
          ...data,
          precio_compra,
          precio_venta,
          precio_reposicion
        }

        await updateArticulo(newData.id, newData)
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

  deleteArticulo: async (id) => {
    const promise = async () => {
      try {
        await removeArticulo(id)
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
