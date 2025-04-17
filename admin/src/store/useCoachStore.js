import { create } from 'zustand'
import {
  createCoach,
  getCoaches,
  removeCoach,
  updateCoach
} from '../api/coaches'
import { toast } from 'sonner'

export const useCoachStore = create((set) => ({
  coaches: [],
  coachesCount: 0,
  loading: false,

  getDataCoaches: async () => {
    set({ loading: true })

    try {
      const res = await getCoaches()

      set(() => ({ coaches: res, coachesCount: res.length }))
    } catch (error) {
      console.error(error)
    } finally {
      set({ loading: false })
    }
  },

  addCoach: async (data) => {
    const promise = async () => {
      try {
        const id = await createCoach(data)
        set((state) => ({
          coaches: [...state.coaches, { id, ...data }]
        }))
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

  editCoach: async (data) => {
    const promise = async () => {
      try {
        await updateCoach(data.id, data)
        set((state) => ({
          coaches: state.coaches.map((user) =>
            user.id === data.id ? { ...user, ...data } : user
          )
        }))
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

  deleteCoach: async (id) => {
    const promise = async () => {
      try {
        await removeCoach(id)
        set((state) => ({
          coaches: state.coaches.filter((user) => user.id !== id)
        }))
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
