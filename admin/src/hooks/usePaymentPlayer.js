import { useEffect } from 'react'
import { useModalStore } from '../store/useModalStore'
import { usePaymentPlayerStore } from '../store/usePaymentPlayerStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { useTemporadasStore } from '../store/useTemporadasStore'
import { toast } from 'sonner'
import { useCalendarStore } from '../store/useCalendarStore'
import Swal from 'sweetalert2'

export const usePaymentPlayer = (handleInputChange) => {
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )
  const getPlayersByTempCat = useCalendarStore(
    (state) => state.getPlayersByTempCat
  )

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const setNestedFormData = useModalStore((state) => state.setNestedFormData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de users
  const loading = usePaymentPlayerStore((state) => state.loading)
  const payments = usePaymentPlayerStore((state) => state.payments)
  const getDataPaymentsPlayer = usePaymentPlayerStore(
    (state) => state.getDataPaymentsPlayer
  )
  const addPayment = usePaymentPlayerStore((state) => state.addPayment)
  const editPayment = usePaymentPlayerStore((state) => state.editPayment)
  const deletePayment = usePaymentPlayerStore((state) => state.deletePayment)
  const getDataFilter = usePaymentPlayerStore((state) => state.getDataFilter)
  const cleanAbono = usePaymentPlayerStore((state) => state.cleanAbono)

  // Store de jugadores
  const getDataPlayers = usePlayerStore((state) => state.getDataPlayers)

  // Inicializar pagos y tipos
  useEffect(() => {
    setNestedFormData('pagos.0.tipo', 'Inscripción')
    setNestedFormData('pagos.1.tipo', 'Coaching')
    setNestedFormData('pagos.2.tipo', 'Túnel')
    setNestedFormData('pagos.3.tipo', 'Botiquín')

    // Solo establecer si no existen (para evitar sobreescribir valores)
    if (!formData.pagos?.[0]?.beca) {
      setNestedFormData('pagos.0.beca', '0')
    }
    if (!formData.pagos?.[0]?.descuento) {
      setNestedFormData('pagos.0.descuento', '0')
    }
    if (!formData.pagos?.[0]?.prorroga) {
      setNestedFormData('pagos.0.prorroga', 'false')
    }
    if (!formData.pagos?.[0]?.fecha_limite) {
      setNestedFormData('pagos.0.fecha_limite', null)
    }

    if (!formData.pagos?.[1]?.descuento) {
      setNestedFormData('pagos.1.descuento', '0')
    }
    if (!formData.pagos?.[1]?.fecha_limite) {
      setNestedFormData('pagos.1.fecha_limite', null)
    }

    if (!formData.pagos?.[0]?.total_abonado) {
      setNestedFormData('pagos.0.total_abonado', '0')
    }
    if (!formData.pagos?.[1]?.total_abonado) {
      setNestedFormData('pagos.1.total_abonado', '0')
    }
    if (!formData.pagos?.[2]?.total_abonado) {
      setNestedFormData('pagos.2.total_abonado', '0')
    }
    if (!formData.pagos?.[3]?.total_abonado) {
      setNestedFormData('pagos.3.total_abonado', '0')
    }

    if (!formData.pagos?.[0]?.estatus)
      setNestedFormData('pagos.0.estatus', 'pendiente')
    if (!formData.pagos?.[1]?.estatus)
      setNestedFormData('pagos.1.estatus', 'pendiente')
    if (!formData.pagos?.[2]?.estatus)
      setNestedFormData('pagos.2.estatus', 'pendiente')
    if (!formData.pagos?.[3]?.estatus)
      setNestedFormData('pagos.3.estatus', 'pendiente')

    if (!formData.pagos?.[0]?.fecha_pago)
      setNestedFormData('pagos.0.fecha_pago', null)
    if (!formData.pagos?.[1]?.fecha_pago)
      setNestedFormData('pagos.1.fecha_pago', null)
    if (!formData.pagos?.[2]?.fecha_pago)
      setNestedFormData('pagos.2.fecha_pago', null)
    if (!formData.pagos?.[3]?.fecha_pago)
      setNestedFormData('pagos.3.fecha_pago', null)

    if (!formData.pagos?.[0]?.metodo_pago)
      setNestedFormData('pagos.0.metodo_pago', null)
    if (!formData.pagos?.[1]?.metodo_pago)
      setNestedFormData('pagos.1.metodo_pago', null)
    if (!formData.pagos?.[2]?.metodo_pago)
      setNestedFormData('pagos.2.metodo_pago', null)
    if (!formData.pagos?.[3]?.metodo_pago)
      setNestedFormData('pagos.3.metodo_pago', null)
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
      const data = await getDataPlayers()
      return data.map((player) => ({
        value: player.id,
        label: `${player.nombre} ${player.apellido_p} ${player.apellido_m}`,
        temporada: player.temporadaId,
        categoria: player.categoria
      }))
    } catch (error) {
      console.error('Error loading users:', error)
      return []
    }
  }

  const loadOptionsTemporadas = async () => {
    try {
      const data = await getDataTemporadas()
      return data.map((temp) => ({
        value: temp.id,
        label: temp.temporada
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  const filterByTempCat = async (temporadaId, categoria) => {
    if (!temporadaId || !categoria) return

    getPlayersByTempCat(temporadaId, categoria)
  }

  const handleFiltrar = () => {
    const temporadaId = formData.temporadaIdFilter
    const categoria = formData.categoriaFilter

    if (!temporadaId || !categoria)
      toast.warning('Selecciona una temporada y una categoría')

    filterByTempCat(temporadaId, categoria)
    getDataFilter(temporadaId, categoria)
  }

  const handleClearFilter = () => {
    handleInputChange({ target: { name: 'temporadaIdFilter', value: null } })
    handleInputChange({ target: { name: 'categoriaFilter', value: null } })
    getDataPaymentsPlayer()
  }

  const handleCleanPay = (id) => {
    Swal.fire({
      title: '¿Estás seguro de limpiar los abonos?',
      text: 'Esta acción no se podrá deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await cleanAbono(id)
        closeModal()
      }
    })
  }

  return {
    payments,
    getDataPaymentsPlayer,
    loading,
    handleSubmit,
    handleDelete,
    loadOptions,
    loadOptionsTemporadas,
    handleFiltrar,
    filterByTempCat,
    handleClearFilter,
    handleCleanPay
  }
}
