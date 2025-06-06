import { useModalStore } from '../store/useModalStore'
import { useCajaStore } from '../store/useCajaStore'
import { toast } from 'sonner'
import { getCoordinadora } from '../api/users'

export const useCaja = (handleInputChange) => {
  // Store de modal
  const formData = useModalStore((state) => state.formData)
  const modalType = useModalStore((state) => state.modalType)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de ordenes de compra
  const loading = useCajaStore((state) => state.loading)
  const caja = useCajaStore((state) => state.caja)
  const getDataCajas = useCajaStore((state) => state.getDataCajas)
  const deleteCaja = useCajaStore((state) => state.deleteCaja)
  const getDataFilter = useCajaStore((state) => state.getDataFilter)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'edit') {
      deleteCaja(formData)
    }

    closeModal()
  }

  const handleFiltrar = () => {
    const coordinadora = formData.coordinadora

    if (!coordinadora) toast.warning('Selecciona una coordinadora para filtrar')

    getDataFilter(coordinadora)
  }

  const handleClearFilter = () => {
    handleInputChange({ target: { name: 'coordinadora', value: null } })
    getDataCajas()
  }

  const loadOptionsCoordinadora = async () => {
    try {
      const data = await getCoordinadora()
      return data.map((coor) => ({
        value: coor.id,
        label: coor.nombre_completo
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  return {
    caja,
    loading,
    getDataCajas,
    handleSubmit,
    handleFiltrar,
    handleClearFilter,
    loadOptionsCoordinadora
  }
}
