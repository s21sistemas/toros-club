import { useCostosJugadoresStore } from '../store/useCostosJugadoresStore'
import { useModalStore } from '../store/useModalStore'
import { useTemporadasStore } from '../store/useTemporadasStore'

export const useCostosJugadores = () => {
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de bank
  const loading = useCostosJugadoresStore((state) => state.loading)
  const costos = useCostosJugadoresStore((state) => state.costos)
  const getDataCostoJugador = useCostosJugadoresStore(
    (state) => state.getDataCostoJugador
  )
  const addCostoJugador = useCostosJugadoresStore(
    (state) => state.addCostoJugador
  )
  const editCostoJugador = useCostosJugadoresStore(
    (state) => state.editCostoJugador
  )
  const deleteCostoJugador = useCostosJugadoresStore(
    (state) => state.deleteCostoJugador
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addCostoJugador(formData)
    } else if (modalType === 'edit') {
      editCostoJugador(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteCostoJugador(id)
    closeModal()
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

  return {
    costos,
    loading,
    getDataCostoJugador,
    handleSubmit,
    handleDelete,
    loadOptionsTemporadas
  }
}
