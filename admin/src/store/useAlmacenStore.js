import { create } from 'zustand'
import {
  createAlmacen,
  getAlmacen,
  removeAlmacen,
  updateAlmacen
} from '../api/almacen'
import { toast } from 'sonner'
import dayjs from 'dayjs'

let unsubscribe = null
export const useAlmacenStore = create((set, get) => ({
  almacen: [],
  loading: false,

  getDataAlmacen: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getAlmacen((data) => {
            set({ almacen: data })
            resolve(data)
          })
        } else {
          resolve(get().almacen)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addAlmacen: async (data) => {
    const promise = async () => {
      try {
        data.fecha = dayjs().format('DD/MM/YYYY')
        await createAlmacen(data)
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

  editAlmacen: async (data) => {
    const promise = async () => {
      try {
        await updateAlmacen(data.id, data)
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

  deleteAlmacen: async (id) => {
    const promise = async () => {
      try {
        await removeAlmacen(id)
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
