import { useModalStore } from '../store/useModalStore'
import { useRoleStore } from '../store/useRoleStore'

export const useRole = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de users
  const loading = useRoleStore((state) => state.loading)
  const roles = useRoleStore((state) => state.roles)
  const getDataRoles = useRoleStore((state) => state.getDataRoles)
  const addRole = useRoleStore((state) => state.addRole)
  const editRole = useRoleStore((state) => state.editRole)
  const deleteRole = useRoleStore((state) => state.deleteRole)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addRole(formData)
    } else if (modalType === 'edit') {
      editRole(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteRole(id)
    closeModal()
  }

  return { roles, getDataRoles, loading, handleSubmit, handleDelete }
}
