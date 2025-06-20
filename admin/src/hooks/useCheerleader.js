import Swal from 'sweetalert2'
import { useCheerleaderStore } from '../store/useCheerleaderStore'
import { useModalStore } from '../store/useModalStore'
import { useUserStore } from '../store/useUserStore'
import { uploadFileToFirebase } from '../utils/uploadFile'
import { toast } from 'sonner'
import { jugadorPorristaSchema } from '../zod/schemas'
import { useTemporadasStore } from '../store/useTemporadasStore'
import { getCoordinadorasPorristas } from '../api/users'

export const useCheerleader = () => {
  // Store de users
  const getDataUsers = useUserStore((state) => state.getDataUsers)
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const setFormData = useModalStore((state) => state.setFormData)
  const closeModal = useModalStore((state) => state.closeModal)
  const firma = useModalStore((state) => state.firma)
  const editFirma = useModalStore((state) => state.editFirma)

  // Store de cheerleader
  const loading = useCheerleaderStore((state) => state.loading)
  const cheerleader = useCheerleaderStore((state) => state.cheerleader)
  const getDataCheerleaders = useCheerleaderStore(
    (state) => state.getDataCheerleaders
  )
  const addCheerleader = useCheerleaderStore((state) => state.addCheerleader)
  const editCheerleader = useCheerleaderStore((state) => state.editCheerleader)
  const deleteCheerleader = useCheerleaderStore(
    (state) => state.deleteCheerleader
  )

  const handleReglamento = () => {
    setFormData('acepta_reglamento', true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación ZOD
    const parsed = jugadorPorristaSchema.safeParse(formData)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0][0]
      toast.error(firstError)
      return
    }

    let signatureFirma = null
    if (firma === null && modalType === 'add') {
      toast.warning('La firma es obligatoría.')
      return
    } else if (firma === null && modalType === 'edit') {
      signatureFirma = formData.documentos.firma
    } else if (firma !== null) {
      signatureFirma = firma
    }

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
      let estatus = 'incompleto'

      if (
        formData.curp &&
        formData.documentos?.curp &&
        formData.documentos?.ine_tutor &&
        formData.documentos?.acta_nacimiento &&
        formData.documentos?.comprobante_domicilio
      ) {
        estatus = 'completo'
      }

      const newFormData = {
        ...formData,
        curp: formData?.curp?.toUpperCase() || '',
        uid: formData.uid.value,
        estatus,
        documentos: {
          ...formData.documentos,
          firma: signatureFirma
        }
      }

      // Subir archivos de documentos (si existen)
      if (newFormData.documentos) {
        const path = `porristas/${newFormData.uid}/documentos`
        for (const key in newFormData.documentos) {
          const file = newFormData.documentos[key]
          if (file instanceof File) {
            // Subir archivo a Firebase y guardar la URL
            const downloadURL = await uploadFileToFirebase(file, path)
            newFormData.documentos[key] = downloadURL
          }
        }
      }

      // Subir foto (si existe)
      if (newFormData.foto && newFormData.foto instanceof File) {
        const path = `porristas/${newFormData.uid}/fotos`
        const downloadURL = await uploadFileToFirebase(newFormData.foto, path)
        newFormData.foto = downloadURL
      }

      if (modalType === 'add') {
        await addCheerleader(newFormData)
      } else if (modalType === 'edit') {
        await editCheerleader(newFormData)
      }
    } catch (error) {
      console.error('Ocurrio un error', error)
      throw new Error('Ocurrió un error', error.message)
    } finally {
      Swal.close()
      closeModal()
      editFirma(null)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCheerleader(id)
    } catch (error) {
      console.error('Ocurrio un error', error)
      throw new Error('Ocurrió un error', error.message)
    } finally {
      closeModal()
    }
  }

  const loadOptions = async () => {
    try {
      const data = await getDataUsers()
      return data.map((user) => ({
        value: user.uid,
        label: user.nombre_completo,
        celular: user.celular,
        correo: user.correo
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

  const loadOptionsCoordPorristas = async () => {
    try {
      const data = await getCoordinadorasPorristas()
      return data.map((cheer) => ({
        value: cheer.id,
        label: cheer.nombre_completo
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  return {
    loadOptions,
    cheerleader,
    loading,
    getDataCheerleaders,
    handleSubmit,
    handleDelete,
    handleReglamento,
    loadOptionsTemporadas,
    loadOptionsCoordPorristas
  }
}
