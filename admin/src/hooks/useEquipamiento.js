import Swal from 'sweetalert2'
import { useEquipamientoStore } from '../store/useEquipamientoStore'
import { useModalStore } from '../store/useModalStore'
import { usePaymentPlayerStore } from '../store/usePaymentPlayerStore'
import { useEffect } from 'react'

export const useEquipamiento = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)
  const setFormData = useModalStore((state) => state.setFormData)

  // Store de equipamiento
  const loading = useEquipamientoStore((state) => state.loading)
  const equipamiento = useEquipamientoStore((state) => state.equipamiento)
  const getDataEquipamiento = useEquipamientoStore(
    (state) => state.getDataEquipamiento
  )
  const addEquipamiento = useEquipamientoStore((state) => state.addEquipamiento)
  const editEquipamiento = useEquipamientoStore(
    (state) => state.editEquipamiento
  )
  const deleteEquipamiento = useEquipamientoStore(
    (state) => state.deleteEquipamiento
  )

  const getDataPaymentsPlayer = usePaymentPlayerStore(
    (state) => state.getDataPaymentsPlayer
  )
  const getDataEquipo = useEquipamientoStore((state) => state.getDataEquipo)

  // Inicializar pagos y tipos
  useEffect(() => {
    if (!formData.numero_serie_casco) {
      setFormData('numero_serie_casco', null)
    }
    if (!formData.numero_serie_hombreras) {
      setFormData('numero_serie_hombreras', null)
    }
    if (!formData.numero_serie_jersey) {
      setFormData('numero_serie_jersey', null)
    }
    if (!formData.talla_jersey) {
      setFormData('talla_jersey', null)
    }
    if (!formData.numero_serie_funda) {
      setFormData('numero_serie_funda', null)
    }
    if (!formData.talla_funda) {
      setFormData('talla_funda', null)
    }
  }, [
    formData.numero_serie_casco,
    formData.numero_serie_funda,
    formData.numero_serie_hombreras,
    formData.numero_serie_jersey,
    formData.talla_funda,
    formData.talla_jersey,
    setFormData
  ])

  const handleSubmit = async (e) => {
    e.preventDefault()

    Swal.fire({
      title:
        '<h2 style="font-family: "sans-serif";">Guardando registro, por favor espere...</h2>',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    try {
      if (modalType === 'add') {
        await addEquipamiento(formData)
      } else if (modalType === 'edit') {
        await editEquipamiento(formData)
      }

      closeModal()
    } catch (error) {
      console.log(error)
    } finally {
      Swal.close()
    }
  }

  const loadOptionsPlayer = async () => {
    try {
      const data = await getDataPaymentsPlayer()
      const inscripcion = data.filter((d) => d.inscripcion === 'pagado')

      return inscripcion.map((user) => user.jugador)
    } catch (error) {
      console.error('Error loading users:', error)
      return []
    }
  }

  const loadOptionsEquipo = async () => {
    try {
      const data = await getDataEquipo()
      return data.map((equipo) => ({
        value: equipo.id,
        label: equipo.nombre
      }))
    } catch (error) {
      console.error('Error loading equipos:', error)
      return []
    }
  }

  const handleDelete = (id) => {
    deleteEquipamiento(id)
    closeModal()
  }

  return {
    equipamiento,
    loading,
    getDataEquipamiento,
    handleSubmit,
    handleDelete,
    loadOptionsPlayer,
    loadOptionsEquipo
  }
}
