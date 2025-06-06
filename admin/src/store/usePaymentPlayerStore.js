import { create } from 'zustand'
import {
  createPayment,
  getPagosJugadoresTempCat,
  getPayments,
  removeAbonos,
  removePayment,
  updatePayment
} from '../api/paymentsPlayer'
import { toast } from 'sonner'
import dayjs from 'dayjs'

let unsubscribe = null
export const usePaymentPlayerStore = create((set, get) => ({
  payments: [],
  loading: false,

  getDataPaymentsPlayer: async () => {
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

  getDataFilter: async (temporadaId, categoria) => {
    const data = await getPagosJugadoresTempCat(temporadaId, categoria)

    unsubscribe = null
    set({ payments: data })
  },

  addPayment: async (data) => {
    const promise = async () => {
      try {
        const actuallyDate = dayjs()
        const dateWeek = actuallyDate.add(1, 'week').format('YYYY/MM/DD')

        data.pagos[0].fecha_limite = dateWeek
        data.jugadorId = data.jugador.value
        data.nombre = data.jugador.label
        delete data.jugador

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
  },

  cleanAbono: async (id) => {
    const promise = async () => {
      try {
        await removeAbonos(id)
      } catch (error) {
        console.error(error)
      }
    }

    toast.promise(promise(), {
      loading: 'Limpiando...',
      success: 'Limpiado de abonos correctamente',
      error: 'Falló al eliminar.'
    })
  }
}))
