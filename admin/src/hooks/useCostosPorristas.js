import { useCostosPorristasStore } from '../store/useCostosPorristasStore'
import { useModalStore } from '../store/useModalStore'
import { useTemporadasStore } from '../store/useTemporadasStore'

export const useCostosPorristas = () => {
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de bank
  const loading = useCostosPorristasStore((state) => state.loading)
  const costos = useCostosPorristasStore((state) => state.costos)
  const getDataCostoPorrista = useCostosPorristasStore(
    (state) => state.getDataCostoPorrista
  )
  const addCostoPorrista = useCostosPorristasStore(
    (state) => state.addCostoPorrista
  )
  const editCostoPorrista = useCostosPorristasStore(
    (state) => state.editCostoPorrista
  )
  const deleteCostoPorrista = useCostosPorristasStore(
    (state) => state.deleteCostoPorrista
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addCostoPorrista(formData)
    } else if (modalType === 'edit') {
      editCostoPorrista(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteCostoPorrista(id)
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
    getDataCostoPorrista,
    handleSubmit,
    handleDelete,
    loadOptionsTemporadas
  }
}
