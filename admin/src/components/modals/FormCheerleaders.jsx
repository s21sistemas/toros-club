import { useModal } from '../../hooks/useModal'
import { InputField } from '../InputField'
import { AlertaCard } from '../AlertaCard'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'
import { formOptions } from '../../utils/formCheerleadersOptions'
import { useCheerleader } from '../../hooks/useCheerleader'
import { SignatureInput } from '../SignatureInput'

import reglamento from '../../assets/docs/reglamento_porristas.pdf'

export const FormCheerleaders = () => {
  const { view, document, formData, handleInputChange, handleFileChange } =
    useModal()
  const {
    loadOptions,
    sigCanvas,
    clearSignature,
    saveSignature,
    handleReglamento,
    loadOptionsTemporadas
  } = useCheerleader()

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <>
      {formData.acepta_reglamento || document ? (
        <>
          <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 md:grid-cols-2 mb-7'>
            <AlertaCard text='Temporada' />
            <InputField
              type='async'
              label='Selecciona la temporada *'
              name='temporadaId'
              required={true}
              value={formData.temporadaId}
              onChange={handleInputChange}
              disabled={view}
              loadOptions={loadOptionsTemporadas}
              classInput='md:col-span-2'
            />

            <AlertaCard text='Datos generales' />
            {formOptions.generalFields.map(
              ({ type, label, name, opcSelect, accept, required }) => (
                <InputField
                  key={name}
                  type={type}
                  label={label}
                  name={name}
                  required={type === 'file' && document ? false : required}
                  value={formData[name] || ''}
                  onChange={
                    type === 'file' ? handleFileChange : handleInputChange
                  }
                  disabled={view}
                  opcSelect={opcSelect}
                  loadOptions={type === 'async' ? loadOptions : () => {}}
                  accept={accept}
                  document={type === 'file' && document}
                />
              )
            )}

            <AlertaCard text='Documentos' />
            {formOptions.documentFields.map(
              ({ type, label, name, accept, required }) => (
                <InputField
                  key={name}
                  type={type}
                  accept={accept}
                  label={label}
                  required={document ? false : required}
                  name={`documentos.${name}`}
                  value={formData.documentos?.[name] || ''}
                  onChange={handleFileChange}
                  disabled={view}
                  document={document}
                />
              )
            )}

            <AlertaCard text='Firma del tutor' />
            <SignatureInput
              view={view}
              formData={formData}
              sigCanvas={sigCanvas}
              clearSignature={clearSignature}
              saveSignature={saveSignature}
            />
          </div>
          <hr className='text-gray-300' />
          {view ? <CancelButtonModal /> : <ButtonsModal />}
        </>
      ) : isMobile ? (
        <div className='text-center'>
          <p className='mb-4 text-gray-700 font-medium'>
            El visor no está disponible en móvil. Puedes abrir o descargar el
            reglamento aquí:
          </p>
          <a
            href={reglamento}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all'
            download
          >
            Descargar reglamento
          </a>
        </div>
      ) : (
        <>
          <div className='mb-5 '>
            <button
              onClick={handleReglamento}
              type='button'
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm cursor-pointer transition-all'
            >
              ¿El padre, madre o tutor acepta el reglamento?
            </button>
          </div>

          <div className='w-full h-[100dvh]'>
            <iframe
              src={reglamento}
              className='w-full h-full border-none'
              title='Visor PDF'
            />
          </div>
        </>
      )}
    </>
  )
}
