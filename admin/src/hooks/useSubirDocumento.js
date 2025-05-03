import Swal from 'sweetalert2'
import { useModalStore } from '../store/useModalStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { uploadFileToFirebase } from '../utils/uploadFile'
import { toast } from 'sonner'
import { useCheerleaderStore } from '../store/useCheerleaderStore'
import { useLocation } from 'react-router'

export const useSubirDocumento = () => {
  const { search } = useLocation()

  // Stores
  const formData = useModalStore((state) => state.formData)
  const firma = useModalStore((state) => state.firma)
  const editFirma = useModalStore((state) => state.editFirma)
  const firmaJugador = useModalStore((state) => state.firmaJugador)
  const editFirmaJugador = useModalStore((state) => state.editFirmaJugador)

  // Store de personas
  const editPlayer = usePlayerStore((state) => state.editPlayer)
  const editCheerleader = useCheerleaderStore((state) => state.editCheerleader)

  const handleSubmitJugador = async (e) => {
    e.preventDefault()
    const uid = search.split('=')[1]

    let signatureFirma = null
    if (firma === null) {
      toast.warning('La firma del tutor es obligatoría.')
      return
    } else if (firma !== null) {
      signatureFirma = firma
    }

    let signatureFirmaJugador = null
    if (firmaJugador === null) {
      toast.warning('La firma del jugador es obligatoría.')
      return
    } else if (firmaJugador !== null) {
      signatureFirmaJugador = firmaJugador
    }

    if (!formData.documentos) {
      toast.warning('Todos los documentos son obligatorios')
      return
    }

    const documentos = formData.documentos
    if (
      !documentos.comprobante_domicilio ||
      !documentos.acta_nacimiento ||
      !documentos.curp ||
      !documentos.ine_tutor
    ) {
      toast.warning('Todos los documentos son obligatorios')
      return
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
      const newFormData = {
        ...formData,
        estatus: 'completo',
        documentos: {
          ...formData.documentos,
          firma: signatureFirma,
          firma_jugador: signatureFirmaJugador
        }
      }
      // Subir archivos de documentos (si existen)
      if (newFormData.documentos) {
        const path = `jugadores/${uid}/documentos`
        for (const key in newFormData.documentos) {
          const file = newFormData.documentos[key]
          if (file instanceof File) {
            const downloadURL = await uploadFileToFirebase(file, path)
            newFormData.documentos[key] = downloadURL
          }
        }
      }

      await editPlayer(newFormData)

      window.location.href = `/subir-documentos?uid=${uid}`
    } catch (error) {
      console.error('Ocurrio un error', error)
    } finally {
      editFirma(null)
      editFirmaJugador(null)
      Swal.close()
    }
  }

  const handleSubmitPorrista = async (e) => {
    e.preventDefault()
    const uid = search.split('=')[1]

    let signatureFirma = null
    if (firma === null) {
      toast.warning('La firma del tutor es obligatoría.')
      return
    } else if (firma !== null) {
      signatureFirma = firma
    }

    let signatureFirmaJugador = null
    if (firmaJugador === null) {
      toast.warning('La firma del jugador es obligatoría.')
      return
    } else if (firmaJugador !== null) {
      signatureFirmaJugador = firmaJugador
    }

    if (!formData.documentos) {
      toast.warning('Todos los documentos son obligatorios')
      return
    }

    const documentos = formData.documentos
    if (
      !documentos.comprobante_domicilio ||
      !documentos.acta_nacimiento ||
      !documentos.curp ||
      !documentos.ine_tutor
    ) {
      toast.warning('Todos los documentos son obligatorios')
      return
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
      const newFormData = {
        ...formData,
        estatus: 'completo',
        documentos: {
          ...formData.documentos,
          firma: signatureFirma,
          firma_jugador: signatureFirmaJugador
        }
      }
      // Subir archivos de documentos (si existen)
      if (newFormData.documentos) {
        const path = `porristas/${uid}/documentos`
        for (const key in newFormData.documentos) {
          const file = newFormData.documentos[key]
          if (file instanceof File) {
            const downloadURL = await uploadFileToFirebase(file, path)
            newFormData.documentos[key] = downloadURL
          }
        }
      }

      await editCheerleader(newFormData)

      window.location.href = `/subir-documentos?uid=${uid}`
    } catch (error) {
      console.error('Ocurrio un error', error)
    } finally {
      editFirma(null)
      editFirmaJugador(null)
      Swal.close()
    }
  }

  return {
    handleSubmitJugador,
    handleSubmitPorrista
  }
}
