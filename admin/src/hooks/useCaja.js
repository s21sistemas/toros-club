import { useModalStore } from '../store/useModalStore'
import { useCajaStore } from '../store/useCajaStore'

export const useCaja = () => {
  // Store de modal
  const formData = useModalStore((state) => state.formData)
  const modalType = useModalStore((state) => state.modalType)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de ordenes de compra
  const loading = useCajaStore((state) => state.loading)
  const caja = useCajaStore((state) => state.caja)
  const getDataCajas = useCajaStore((state) => state.getDataCajas)
  const deleteCaja = useCajaStore((state) => state.deleteCaja)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'edit') {
      deleteCaja(formData)
    }

    closeModal()
  }

  return {
    caja,
    loading,
    getDataCajas,
    handleSubmit
  }
}
