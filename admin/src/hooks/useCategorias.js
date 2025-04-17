import { useCategoriaStore } from '../store/useCategoriaStore'
import { useModalStore } from '../store/useModalStore'
import { useTemporadasStore } from '../store/useTemporadasStore'

export const useCategorias = () => {
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de bank
  const loading = useCategoriaStore((state) => state.loading)
  const categorias = useCategoriaStore((state) => state.categorias)
  const getDataCategorias = useCategoriaStore(
    (state) => state.getDataCategorias
  )
  const addCategoria = useCategoriaStore((state) => state.addCategoria)
  const editCategoria = useCategoriaStore((state) => state.editCategoria)
  const deleteCategoria = useCategoriaStore((state) => state.deleteCategoria)

  const handleSubmit = (e) => {
    e.preventDefault()

    const newFormData = {
      ...formData,
      temporada: formData.temporadaId.label,
      temporada_id: formData.temporadaId.value
    }

    if (modalType === 'add') {
      addCategoria(newFormData)
    } else if (modalType === 'edit') {
      editCategoria(newFormData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteCategoria(id)
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
    categorias,
    loading,
    getDataCategorias,
    handleSubmit,
    handleDelete,
    loadOptionsTemporadas
  }
}
