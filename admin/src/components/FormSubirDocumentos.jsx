import { Upload, FileText, CreditCard, User, LetterText } from 'lucide-react'
import { useModal } from '../hooks/useModal'
import { useSubirDocumento } from '../hooks/useSubirDocumento'
import { useEffect } from 'react'
import { SubirFirmaTutor } from './SubirFirmaTutor'
import { SubirFirmaJugador } from './SubirFirmaJugador'

export const FormSubirDocumentos = ({ id, persona }) => {
  const { formData, handleFileChange, handleInputChange, setFormData } =
    useModal()
  const { handleSubmitJugador, handleSubmitPorrista } = useSubirDocumento()

  useEffect(() => {
    setFormData('id', id)
  }, [id])

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8'>
        <form
          className='space-y-6'
          onSubmit={
            persona === 'jugador' ? handleSubmitJugador : handleSubmitPorrista
          }
        >
          {/* CAMPO CURP */}
          <div className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'>
            <label className='flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer'>
              <div className='flex-shrink-0 bg-gray-100 p-3 rounded-lg'>
                <LetterText className='h-6 w-6 text-gray-600' />
              </div>
              <div className='flex-grow'>
                <span className='block text-sm font-medium text-gray-700'>
                  CURP
                </span>
                <span className='block text-xs text-gray-500 mt-1'>
                  Clave Única de Registro de Población
                </span>
              </div>
              <input
                type='text'
                className='rounded-md px-2 py-1 border border-gray-500'
                name='curp'
                placeholder='SATJ000704HDGLRVA4'
                onChange={handleInputChange}
              />
            </label>
          </div>

          {/* CURP */}
          <div className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'>
            <label className='flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer'>
              <div className='flex-shrink-0 bg-gray-100 p-3 rounded-lg'>
                <User className='h-6 w-6 text-gray-600' />
              </div>
              <div className='flex-grow'>
                <span className='block text-sm font-medium text-gray-700'>
                  CURP
                </span>
                <span className='block text-xs text-gray-500 mt-1'>
                  Documento de Clave Única de Registro de Población
                </span>
              </div>
              <div className='flex items-center justify-center bg-gray-50 px-4 py-2 rounded-md border border-gray-200'>
                <Upload className='h-4 w-4 text-gray-500 mr-2' />
                <span className='text-sm text-gray-600'>
                  {formData.documentos?.curp
                    ? 'Archivo aregado'
                    : 'Subir archivo'}
                </span>
              </div>
              <input
                type='file'
                className='hidden'
                name='documentos.curp'
                onChange={handleFileChange}
                accept='application/pdf'
              />
            </label>
          </div>

          {/* Comprobante de domicilio */}
          <div className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'>
            <label className='flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer'>
              <div className='flex-shrink-0 bg-gray-100 p-3 rounded-lg'>
                <FileText className='h-6 w-6 text-gray-600' />
              </div>
              <div className='flex-grow'>
                <span className='block text-sm font-medium text-gray-700'>
                  Comprobante de domicilio
                </span>
                <span className='block text-xs text-gray-500 mt-1'>
                  Sube un documento reciente
                </span>
              </div>
              <div className='flex items-center justify-center bg-gray-50 px-4 py-2 rounded-md border border-gray-200'>
                <Upload className='h-4 w-4 text-gray-500 mr-2' />
                <span className='text-sm text-gray-600'>
                  {formData.documentos?.comprobante_domicilio
                    ? 'Archivo aregado'
                    : 'Subir archivo'}
                </span>
              </div>
              <input
                type='file'
                className='hidden'
                onChange={handleFileChange}
                name='documentos.comprobante_domicilio'
                accept='.pdf'
              />
            </label>
          </div>

          {/* Acta de nacimiento */}
          <div className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'>
            <label className='flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer'>
              <div className='flex-shrink-0 bg-gray-100 p-3 rounded-lg'>
                <FileText className='h-6 w-6 text-gray-600' />
              </div>
              <div className='flex-grow'>
                <span className='block text-sm font-medium text-gray-700'>
                  Acta de nacimiento
                </span>
                <span className='block text-xs text-gray-500 mt-1'>
                  Documento oficial completo y legible
                </span>
              </div>
              <div className='flex items-center justify-center bg-gray-50 px-4 py-2 rounded-md border border-gray-200'>
                <Upload className='h-4 w-4 text-gray-500 mr-2' />
                <span className='text-sm text-gray-600'>
                  {formData.documentos?.acta_nacimiento
                    ? 'Archivo aregado'
                    : 'Subir archivo'}
                </span>
              </div>
              <input
                type='file'
                className='hidden'
                onChange={handleFileChange}
                name='documentos.acta_nacimiento'
                accept='application/pdf'
              />
            </label>
          </div>

          {/* INE */}
          <div className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'>
            <label className='flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer'>
              <div className='flex-shrink-0 bg-gray-100 p-3 rounded-lg'>
                <CreditCard className='h-6 w-6 text-gray-600' />
              </div>
              <div className='flex-grow'>
                <span className='block text-sm font-medium text-gray-700'>
                  INE
                </span>
                <span className='block text-xs text-gray-500 mt-1'>
                  Identificación oficial vigente
                </span>
              </div>
              <div className='flex items-center justify-center bg-gray-50 px-4 py-2 rounded-md border border-gray-200'>
                <Upload className='h-4 w-4 text-gray-500 mr-2' />
                <span className='text-sm text-gray-600'>
                  {formData.documentos?.ine_tutor
                    ? 'Archivo aregado'
                    : 'Subir archivo'}
                </span>
              </div>
              <input
                type='file'
                className='hidden'
                name='documentos.ine_tutor'
                onChange={handleFileChange}
                accept='application/pdf'
              />
            </label>
          </div>

          {/* Firmas */}
          <div className='mt-10'>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Firmas</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Firma del jugador */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Firma del jugador/porrista
                </label>
                <div className='bg-white rounded-lg flex items-center justify-center'>
                  <SubirFirmaJugador />
                </div>
              </div>

              {/* Firma del tutor */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Firma del tutor
                </label>
                <div className='bg-white rounded-lg flex items-center justify-center'>
                  <SubirFirmaTutor />
                </div>
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className='mt-8'>
            <button
              type='submit'
              className='cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Enviar documentos
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
