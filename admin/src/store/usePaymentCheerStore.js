import { create } from 'zustand'
import { toast } from 'sonner'
import {
  createPayment,
  getPayments,
  removePayment,
  updatePayment
} from '../api/paymentsCheer'

let unsubscribe = null
export const usePaymentCheerStore = create((set, get) => ({
  payments: [],
  loading: false,

  getDataPaymentsCheer: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getPayments((data) => {
            set({ payments: data })
            resolve(data)
          })
        } else {
          resolve(get().payments)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addPayment: async (data) => {
    const promise = async () => {
      try {
        await createPayment(data)
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

  editPayment: async (data) => {
    const promise = async () => {
      try {
        await updatePayment(data.id, data)
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

  deletePayment: async (id) => {
    const promise = async () => {
      try {
        await removePayment(id)
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
