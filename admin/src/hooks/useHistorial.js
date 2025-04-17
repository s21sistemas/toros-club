import { useModalStore } from '../store/useModalStore'
import { useHistorialStore } from '../store/useHistorialStore'

export const useHistorial = () => {
  // Store de modal
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de ordenes de compra
  const loading = useHistorialStore((state) => state.loading)
  const historial = useHistorialStore((state) => state.historial)
  const getDataHistorial = useHistorialStore((state) => state.getDataHistorial)
  const deleteHistorial = useHistorialStore((state) => state.deleteHistorial)

  const handleDelete = (id) => {
    deleteHistorial(id)
    closeModal()
  }

  return {
    historial,
    loading,
    getDataHistorial,
    handleDelete
  }
}
