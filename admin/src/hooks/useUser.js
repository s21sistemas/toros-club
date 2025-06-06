import { toast } from 'sonner'
import { useModalStore } from '../store/useModalStore'
import { useUserStore } from '../store/useUserStore'
import { usuarioSchema } from '../zod/schemas'
import { useTemporadasStore } from '../store/useTemporadasStore'
import { getCheerleadersCoord } from '../api/cheerleader'

export const useUser = () => {
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de users
  const loading = useUserStore((state) => state.loading)
  const users = useUserStore((state) => state.users)
  const getDataUsers = useUserStore((state) => state.getDataUsers)
  const addUser = useUserStore((state) => state.addUser)
  const editUser = useUserStore((state) => state.editUser)
  const deleteUser = useUserStore((state) => state.deleteUser)

  const roles = useUserStore((state) => state.roles)
  const getDataRoles = useUserStore((state) => state.getDataRoles)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación ZOD
    const parsed = usuarioSchema.safeParse(formData)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0][0]
      toast.error(firstError)
      return
    }

    const newFormData = {
      ...formData,
      rol_id: formData.rol_id.value
    }

    if (modalType === 'add') {
      addUser(newFormData)
    } else if (modalType === 'edit') {
      editUser(newFormData)
    }

    closeModal()
  }

  const handleDelete = (id, uid) => {
    deleteUser(id, uid)
    closeModal()
  }

  const loadOptions = async () => {
    try {
      const data = await getDataRoles()
      return data.map((rol) => ({
        value: rol.id,
        label: rol.nombre
      }))
    } catch (error) {
      console.error('Error loading roles:', error)
      return []
    }
  }

  const loadOptionsTemporadas = async () => {
    try {
      const data = await getDataTemporadas()
      return data.map((temp) => ({
        value: temp.id,
        label: temp.temporada
      }))
    } catch (error) {
      console.error('Error loading temporadas:', error)
      return []
    }
  }

  const loadOptionsPorristas = async () => {
    try {
      const data = await getCheerleadersCoord()
      return data.map((cheer) => ({
        value: cheer.id,
        label: `${cheer.nombre} ${cheer.apellido_p} ${cheer.apellido_m}`
      }))
    } catch (error) {
      console.error('Error loading temporadas:', error)
      return []
    }
  }

  return {
    loadOptions,
    loadOptionsTemporadas,
    loadOptionsPorristas,
    roles,
    getDataRoles,
    users,
    getDataUsers,
    loading,
    handleSubmit,
    handleDelete
  }
}
