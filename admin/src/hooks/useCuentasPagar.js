import { useCuentasPagarStore } from '../store/useCuentasPagarStore'
import { useModalStore } from '../store/useModalStore'

export const useCuentasPagar = () => {
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de cuentas
  const loading = useCuentasPagarStore((state) => state.loading)
  const cuentasPagar = useCuentasPagarStore((state) => state.cuentasPagar)
  const editOrdenCompra = useCuentasPagarStore((state) => state.editOrdenCompra)
  const getDataCuentasPagar = useCuentasPagarStore(
    (state) => state.getDataCuentasPagar
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'edit') {
      editOrdenCompra(formData)
    }

    closeModal()
  }

  return {
    cuentasPagar,
    loading,
    getDataCuentasPagar,
    handleSubmit
  }
}
