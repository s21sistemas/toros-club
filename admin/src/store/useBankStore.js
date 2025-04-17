import { create } from 'zustand'
import { createBank, getBanks, removeBank, updateBank } from '../api/banks'
import { toast } from 'sonner'

let unsubscribe = null
export const useBankStore = create((set, get) => ({
  banks: [],
  banksCount: 0,
  loading: false,

  getDataBanks: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getBanks((data) => {
            set({ banks: data, banksCount: data.length })
            resolve(data)
          })
        } else {
          resolve(get().banks)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addBank: async (data) => {
    const promise = async () => {
      try {
        await createBank(data)
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

  editBank: async (data) => {
    const promise = async () => {
      try {
        await updateBank(data.id, data)
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

  deleteBank: async (id) => {
    const promise = async () => {
      try {
        await removeBank(id)
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
