import { create } from 'zustand'
import { createUser, getUsers, removeUser, updateUser } from '../api/users'
import { getRoles } from '../api/roles'
import { toast } from 'sonner'

let unsubscribe = null
export const useUserStore = create((set, get) => ({
  users: [],
  usersCount: 0,
  roles: [],
  loading: false,

  getDataRoles: async () => {
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

  getDataUsers: async () => {
    set({ loading: true })

    try {
      const res = await getUsers()

      set(() => ({ users: res, usersCount: res.length }))

      return res
    } catch (error) {
      console.error(error)
    } finally {
      set({ loading: false })
    }
  },

  addUser: async (data) => {
    const promise = async () => {
      try {
        const { id, userData } = await createUser(data)
        const { roles } = get()
        const rolName =
          roles.find((r) => r.id === data.rol_id)?.nombre || 'Sin rol'

        set((state) => ({
          users: [...state.users, { id, ...userData, rol: rolName }]
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

  editUser: async (data) => {
    const promise = async () => {
      try {
        await updateUser(data.id, data)

        const { roles } = get()

        const rolName =
          roles.find((r) => r.id === data.rol_id)?.nombre || 'Sin rol'

        set((state) => ({
          users: state.users.map((user) =>
            user.id === data.id ? { ...user, ...data, rol: rolName } : user
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

  deleteUser: async (id, uid) => {
    const promise = async () => {
      try {
        await removeUser(id, uid)
        set((state) => ({
          users: state.users.filter((user) => user.id !== id)
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
