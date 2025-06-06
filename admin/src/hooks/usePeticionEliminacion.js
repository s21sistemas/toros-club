import { usePeticionEliminacionStore } from '../store/usePeticionEliminacionStore'
import { useModalStore } from '../store/useModalStore'

export const usePeticionEliminacion = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de bank
  const loading = usePeticionEliminacionStore((state) => state.loading)
  const peticionEliminacion = usePeticionEliminacionStore(
    (state) => state.peticionEliminacion
  )
  const getDataPeticionEliminacion = usePeticionEliminacionStore(
    (state) => state.getDataPeticionEliminacion
  )
  const addPeticionEliminacion = usePeticionEliminacionStore(
    (state) => state.addPeticionEliminacion
  )
  const editPeticionEliminacion = usePeticionEliminacionStore(
    (state) => state.editPeticionEliminacion
  )
  const deletePeticionEliminacion = usePeticionEliminacionStore(
    (state) => state.deletePeticionEliminacion
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addPeticionEliminacion(formData)
    } else if (modalType === 'edit') {
      editPeticionEliminacion(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deletePeticionEliminacion(id)
    closeModal()
  }

  return {
    peticionEliminacion,
    loading,
    getDataPeticionEliminacion,
    handleSubmit,
    handleDelete
  }
}
