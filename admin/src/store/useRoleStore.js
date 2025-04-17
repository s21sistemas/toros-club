import { create } from 'zustand'
import { createRole, getRoles, removeRole, updateRole } from '../api/roles'
import { toast } from 'sonner'

let unsubscribe = null
export const useRoleStore = create((set, get) => ({
  roles: [],
  loading: false,

  getDataRoles: async () => {
    set({ loading: true })

    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribe) {
          unsubscribe = getRoles((data) => {
            set({ roles: data })
            resolve(data)
          })
        } else {
          resolve(get().roles)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  addRole: async (data) => {
    const promise = async () => {
      try {
        await createRole(data)
      } catch (error) {
        console.error('Error adding role:', error)
        throw error // Re-lanza el error para que `toast.promise` lo capture
      }
    }

    toast.promise(promise(), {
      loading: 'Creando registro...',
      success: 'Registro creado correctamente',
      error: 'Falló al crear el registro.'
    })
  },

  editRole: async (data) => {
    const promise = async () => {
      try {
        await updateRole(data.id, data)
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

  deleteRole: async (id) => {
    const promise = async () => {
      try {
        await removeRole(id)
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
