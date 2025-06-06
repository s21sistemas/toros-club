import { create } from 'zustand'
import {
  createCaja,
  getCajaCoordinadora,
  listenCaja,
  removeCaja
} from '../api/caja'
import { toast } from 'sonner'

let unsubscribe = null
export const useCajaStore = create((set, get) => ({
  caja: [],
  loading: false,

  getDataCajas: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = listenCaja((data) => {
            set({ caja: data })
            resolve(data)
          })
        } else {
          resolve(get().caja)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  getDataFilter: async (coordinadora) => {
    const data = await getCajaCoordinadora(coordinadora)

    unsubscribe = null
    set({ caja: data })
  },

  addCaja: async (data) => {
    const promise = async () => {
      try {
        await createCaja(data)
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

  deleteCaja: async (data) => {
    const promise = async () => {
      try {
        await removeCaja(data)
      } catch (error) {
        console.error(error)
      }
    }

    toast.promise(promise(), {
      loading: 'Guardando pago...',
      success: 'Pago guardado correctamente',
      error: 'Falló al guardar.'
    })
  }
}))
