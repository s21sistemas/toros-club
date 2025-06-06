import { useModal } from '../../hooks/useModal'
import { InputField } from '../InputField'
import { AlertaCard } from '../AlertaCard'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'
import { formOptions } from '../../utils/formPlayersOptions'
import { usePlayer } from '../../hooks/usePlayer'
import { SignatureInput } from '../SignatureInput'

import reglamento from '../../assets/docs/reglamento.pdf'

export const FormPlayers = () => {
  const {
    view,
    document,
    edit,
    formData,
    handleInputChange,
    handleFileChange,
    categoriaOptions
  } = useModal()

  const {
    handleTipo,
    tipo,
    loadOptions,
    sigCanvas,
    clearSignature,
    saveSignature,
    loadOptionsTemporadas,
    handleReglamento
  } = usePlayer(handleInputChange)

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

            <AlertaCard text='Tipo de inscripción' />
            <InputField
              type='select'
              label='Selecciona el tipo de inscripción *'
              name='tipo_inscripcion'
              value={formData.tipo_inscripcion}
              required={true}
              onChange={handleTipo}
              disabled={view}
              opcSelect={formOptions.tipoInscripcion}
              classInput='md:col-span-2'
            />

            {tipo === 'transferencia' && (
              <>
                <AlertaCard text='Datos de transferencia' />
                {formOptions.transferenciaFields.map(
                  ({ type, label, name, required, opcSelect }) => (
                    <InputField
                      key={name}
                      type={type}
                      label={label}
                      required={required}
                      opcSelect={opcSelect}
                      name={`transferencia.${name}`}
                      value={formData.transferencia?.[name] || ''}
                      onChange={handleInputChange}
                      disabled={view}
                    />
                  )
                )}
              </>
            )}

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
                  opcSelect={
                    name === 'categoria' ? categoriaOptions || [] : opcSelect
                  }
                  loadOptions={type === 'async' ? loadOptions : () => {}}
                  accept={accept}
                  document={type === 'file' && document}
                />
              )
            )}

            {edit && (
              <>
                <InputField
                  type='select'
                  label='Activo'
                  name='activo'
                  required={false}
                  opcSelect={formOptions.activoOptions}
                  value={formData.activo || ''}
                  onChange={handleInputChange}
                  disabled={view}
                />
              </>
            )}

            <AlertaCard text='Documentos' />
            {formOptions.documentFields.map(({ type, label, name, accept }) => (
              <InputField
                key={name}
                type={type}
                accept={accept}
                label={label}
                required={false}
                name={`documentos.${name}`}
                value={formData.documentos?.[name] || ''}
                onChange={handleFileChange}
                disabled={view}
                document={document}
              />
            ))}

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
          <p className='mb-4 text-gray-700 font-medium text-sm sm:text-base'>
            El visor no está disponible en móvil. Puedes abrir o descargar el
            reglamento aquí:
          </p>
          <a
            href={reglamento}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all mb-5'
            download
          >
            Descargar reglamento
          </a>

          <p className='text-sm sm:px-5 sm:text-base text-justify mb-5 text-gray-700'>
            Declaro bajo protesta de decir verdad que la información y
            documentación proporcionada en esta aplicación y presentada al club
            toros es verídica, por lo que en caso de existir falsedad en ella
            deslindo de toda responsabilidad al Club Toros y tengo pleno
            conocimiento que se aplicarán las sanciones administrativas y penas
            establecidas en los ordenamientos del reglamento establecido por la
            liga.
          </p>

          <div className='mb-5'>
            <button
              onClick={handleReglamento}
              type='button'
              className='text-xs w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm md:text-base cursor-pointer transition-all'
            >
              Al dar click aquí, aceptas el reglamento y los terminos y
              condiciones.
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='mb-5 '>
            <button
              onClick={handleReglamento}
              type='button'
              className='text-xs w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm md:text-base cursor-pointer transition-all'
            >
              Al dar click aquí, aceptas el reglamento y los terminos y
              condiciones.
            </button>
          </div>

          <p className='text-sm sm:px-5 sm:text-base text-justify mb-5 text-gray-700'>
            Declaro bajo protesta de decir verdad que la información y
            documentación proporcionada en esta aplicación y presentada al club
            toros es verídica, por lo que en caso de existir falsedad en ella
            deslindo de toda responsabilidad al Club Toros y tengo pleno
            conocimiento que se aplicarán las sanciones administrativas y penas
            establecidas en los ordenamientos del reglamento establecido por la
            liga.
          </p>

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
