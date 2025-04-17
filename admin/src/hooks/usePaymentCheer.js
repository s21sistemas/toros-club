import { useEffect } from 'react'
import { useModalStore } from '../store/useModalStore'
import { usePaymentCheerStore } from '../store/usePaymentCheerStore'
import { useCheerleaderStore } from '../store/useCheerleaderStore'

export const usePaymentCheer = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const setNestedFormData = useModalStore((state) => state.setNestedFormData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de users
  const loading = usePaymentCheerStore((state) => state.loading)
  const payments = usePaymentCheerStore((state) => state.payments)
  const getDataPaymentsCheer = usePaymentCheerStore(
    (state) => state.getDataPaymentsCheer
  )
  const addPayment = usePaymentCheerStore((state) => state.addPayment)
  const editPayment = usePaymentCheerStore((state) => state.editPayment)
  const deletePayment = usePaymentCheerStore((state) => state.deletePayment)

  // Store de jugadores
  const getDataCheerleaders = useCheerleaderStore(
    (state) => state.getDataCheerleaders
  )

  // Inicializar pagos y tipos
  useEffect(() => {
    setNestedFormData('pagos.0.tipo', 'Inscripción')
    setNestedFormData('pagos.1.tipo', 'Coaching')

    // Solo establecer si no existen (para evitar sobreescribir valores)
    if (!formData.pagos?.[0]?.estatus)
      setNestedFormData('pagos.0.estatus', 'pendiente')
    if (!formData.pagos?.[0]?.fecha_pago)
      setNestedFormData('pagos.0.fecha_pago', null)
    if (!formData.pagos?.[0]?.fecha_pago)
      setNestedFormData('pagos.0.metodo_pago', null)
    if (!formData.pagos?.[1]?.estatus)
      setNestedFormData('pagos.1.estatus', 'pendiente')
    if (!formData.pagos?.[1]?.fecha_pago)
      setNestedFormData('pagos.1.fecha_pago', null)
    if (!formData.pagos?.[1]?.fecha_pago)
      setNestedFormData('pagos.1.metodo_pago', null)

    if (!formData.pagos?.[0]?.total_abonado) {
      setNestedFormData('pagos.0.total_abonado', '0')
    }
    if (!formData.pagos?.[1]?.total_abonado) {
      setNestedFormData('pagos.1.total_abonado', '0')
    }
  }, [formData.pagos, setNestedFormData])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (modalType === 'add') {
        await addPayment(formData)
      } else if (modalType === 'edit') {
        await editPayment(formData)
      }
    } catch (error) {
      console.log(error)
    } finally {
      closeModal()
    }
  }

  const handleDelete = async (id) => {
    await deletePayment(id)
    closeModal()
  }

  const loadOptions = async () => {
    try {
      const data = await getDataCheerleaders()

      return data.map((cheer) => ({
        value: cheer.id,
        label: `${cheer.nombre} ${cheer.apellido_p} ${cheer.apellido_m}`
      }))
    } catch (error) {
      console.error('Error loading users:', error)
      return []
    }
  }

  return {
    payments,
    getDataPaymentsCheer,
    loading,
    handleSubmit,
    handleDelete,
    loadOptions
  }
}
