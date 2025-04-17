import { useCoachStore } from '../store/useCoachStore'
import { useModalStore } from '../store/useModalStore'

export const useCoach = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de coaches
  const loading = useCoachStore((state) => state.loading)
  const coaches = useCoachStore((state) => state.coaches)
  const getDataCoaches = useCoachStore((state) => state.getDataCoaches)
  const addCoach = useCoachStore((state) => state.addCoach)
  const editCoach = useCoachStore((state) => state.editCoach)
  const deleteCoach = useCoachStore((state) => state.deleteCoach)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addCoach(formData)
    } else if (modalType === 'edit') {
      editCoach(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteCoach(id)
    closeModal()
  }

  return { coaches, loading, getDataCoaches, handleSubmit, handleDelete }
}
