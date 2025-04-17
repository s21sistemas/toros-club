import SignatureCanvas from 'react-signature-canvas'
import { FilePen, Save, SquareX } from 'lucide-react'
import { useSignature } from '../hooks/useSignature'

export const SignatureInput = ({ view, formData }) => {
  const { sigCanvas, clearSignature, saveSignature } = useSignature()

  return (
    <div className='sm:col-span-6 md:col-span-2'>
      {view ? (
        <>
          <p className='text-sm text-gray-600 mb-1'>Imagen de la firma:</p>
          <img
            className='border-5 border-[#27548A] border-double w-full h-60'
            src={formData?.documentos?.firma}
            alt={`Firma del tutor del jugador ${formData?.nombre} ${formData?.apellido_p} ${formData?.apellido_m}`}
          />
        </>
      ) : (
        <>
          {formData?.documentos?.firma && (
            <a
              href={formData.documentos.firma}
              target='_blank'
              className='text-md w-[max-content] ml-auto font-semibold text-gray-800 mb-2 flex items-center justify-end hover:text-gray-400 transition-all'
            >
              Ver firma actual
              <FilePen className='h-4' />
            </a>
          )}

          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: 'border-5 border-[#27548A] border-double w-full h-60'
            }}
          />

          <div className='flex mt-4 flex-col items-center gap-3 justify-center sm:flex-row sm:justify-around'>
            <button
              onClick={clearSignature}
              type='button'
              className='py-2 px-4 bg-primary rounded-sm text-white flex items-center gap-2 cursor-pointer hover:bg-primary-dark transition-all'
            >
              <SquareX /> Limpiar firma
            </button>

            <button
              onClick={saveSignature}
              type='button'
              className='py-2 px-4 bg-[#1F7D53] rounded-sm text-white flex items-center gap-2 cursor-pointer hover:bg-[#255F38] transition-all'
            >
              <Save /> Guardar firma
            </button>
          </div>
        </>
      )}
    </div>
  )
}
