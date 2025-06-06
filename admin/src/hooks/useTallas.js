import { useModalStore } from '../store/useModalStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { useTallasStore } from '../store/useTallasStore'

export const useTallas = () => {
  // Stores extras
  const getDataPlayers = usePlayerStore((state) => state.getDataPlayers)

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de ordenes de compra
  const loading = useTallasStore((state) => state.loading)
  const tallas = useTallasStore((state) => state.tallas)
  const getDataTalla = useTallasStore((state) => state.getDataTalla)
  const addTalla = useTallasStore((state) => state.addTalla)
  const editTalla = useTallasStore((state) => state.editTalla)
  const deleteTalla = useTallasStore((state) => state.deleteTalla)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addTalla(formData)
    } else if (modalType === 'edit') {
      editTalla(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteTalla(id)
    closeModal()
  }

  const loadOptionsJugadores = async () => {
    try {
      const data = await getDataPlayers()

      return data.map((jugador) => ({
        value: jugador.id,
        label: jugador.nombre_completo
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  return {
    loadOptionsJugadores,
    tallas,
    loading,
    getDataTalla,
    handleSubmit,
    handleDelete
  }
}
