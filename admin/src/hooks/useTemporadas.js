import { useTemporadasStore } from '../store/useTemporadasStore'
import { useModalStore } from '../store/useModalStore'

export const useTemporadas = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de bank
  const loading = useTemporadasStore((state) => state.loading)
  const temporadas = useTemporadasStore((state) => state.temporadas)
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )
  const addTemporada = useTemporadasStore((state) => state.addTemporada)
  const editTemporada = useTemporadasStore((state) => state.editTemporada)
  const deleteTemporada = useTemporadasStore((state) => state.deleteTemporada)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addTemporada(formData)
    } else if (modalType === 'edit') {
      editTemporada(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteTemporada(id)
    closeModal()
  }

  return {
    temporadas,
    loading,
    getDataTemporadas,
    handleSubmit,
    handleDelete
  }
}
