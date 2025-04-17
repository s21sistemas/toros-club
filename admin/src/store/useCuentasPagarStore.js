import { create } from 'zustand'
import { getCuentasPagar, updatCuentasPagar } from '../api/cuentas_pagar'
import { toast } from 'sonner'

let unsubscribe = null
export const useCuentasPagarStore = create((set, get) => ({
  cuentasPagar: [],
  loading: false,

  getDataCuentasPagar: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getCuentasPagar((data) => {
            set({ cuentasPagar: data })
            resolve(data)
          })
        } else {
          resolve(get().cuentasPagar)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  editOrdenCompra: async (data) => {
    const promise = async () => {
      try {
        await updatCuentasPagar(data.id, data)
      } catch (error) {
        console.error(error)
      }
    }

    toast.promise(promise(), {
      loading: 'Actualizando...',
      success: 'Actualizado correctamente',
      error: 'Falló al eliminar.'
    })
  }
}))
