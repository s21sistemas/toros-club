import { useModalStore } from '../store/useModalStore'
import { useHistorialStore } from '../store/useHistorialStore'

export const useHistorial = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de ordenes de compra
  const loading = useHistorialStore((state) => state.loading)
  const historial = useHistorialStore((state) => state.historial)
  const getDataHistorial = useHistorialStore((state) => state.getDataHistorial)
  const editHistorial = useHistorialStore((state) => state.editHistorial)
  const deleteHistorial = useHistorialStore((state) => state.deleteHistorial)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (modalType === 'edit') {
      editHistorial(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteHistorial(id)
    closeModal()
  }

  return {
    historial,
    loading,
    getDataHistorial,
    handleSubmit,
    handleDelete
  }
}
