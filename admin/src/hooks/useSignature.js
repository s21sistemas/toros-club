import { useRef } from 'react'
import { toast } from 'sonner'
import { base64ToFile } from '../utils/base64ToFile'
import { useModalStore } from '../store/useModalStore'

export const useSignature = () => {
  const sigCanvas = useRef(null)
  const editFirma = useModalStore((state) => state.editFirma)

  const clearSignature = () => {
    sigCanvas.current.clear()
    editFirma(null)
  }

  const saveSignature = () => {
    const signatureData = sigCanvas.current.toDataURL('image/png')
    const signatureFile = base64ToFile(signatureData, 'firma.png')
    editFirma(signatureFile)

    toast.success('Firma del tutor guardada')
  }

  const sigCanvasJugador = useRef(null)
  const editFirmaJugador = useModalStore((state) => state.editFirmaJugador)

  const clearSignatureJugador = () => {
    sigCanvasJugador.current.clear()
    editFirmaJugador(null)
  }

  const saveSignatureJugador = () => {
    const signatureData = sigCanvasJugador.current.toDataURL('image/png')
    const signatureFile = base64ToFile(signatureData, 'firma_jugador.png')
    editFirmaJugador(signatureFile)

    toast.success('Firma del jugador/porrista guardada')
  }

  return {
    sigCanvas,
    clearSignature,
    saveSignature,
    sigCanvasJugador,
    clearSignatureJugador,
    saveSignatureJugador
  }
}
