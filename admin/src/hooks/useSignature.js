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

    toast.success('Firma guardada')
  }

  return {
    sigCanvas,
    clearSignature,
    saveSignature
  }
}
