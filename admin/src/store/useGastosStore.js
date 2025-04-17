import { create } from 'zustand'
import { createGasto, getGastos, removeGasto, updateGasto } from '../api/gastos'
import { toast } from 'sonner'
import dayjs from 'dayjs'

let unsubscribe = null
export const useGastosStore = create((set, get) => ({
  gastos: [],
  loading: false,

  getDataGastos: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getGastos((data) => {
            set({ gastos: data })
            resolve(data)
          })
        } else {
          resolve(get().gastos)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addGastos: async (data) => {
    const promise = async () => {
      try {
        await createGasto(data)
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

  editGastos: async (data) => {
    const promise = async () => {
      try {
        await updateGasto(data.id, data)
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

  deleteGastos: async (id) => {
    const promise = async () => {
      try {
        await removeGasto(id)
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
