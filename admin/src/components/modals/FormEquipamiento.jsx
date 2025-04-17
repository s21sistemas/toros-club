import { useEquipamiento } from '../../hooks/useEquipamiento'
import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formEquipamientoOptions'
import { AlertaCard } from '../AlertaCard'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormEquipamiento = () => {
  const { view, formData, document, handleInputChange } = useModal()
  const { loadOptionsPlayer, loadOptionsEquipo } = useEquipamiento()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='md:col-span-6 sm:col-span-6'>
          <AlertaCard text='Jugador' />
        </div>

        {formOptions.jugadorFields.map(
          ({ type, label, name, required, note }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              name={name}
              note={note}
              required={required}
              value={formData[name] || ''}
              onChange={handleInputChange}
              disabled={view || formData.devuelto === 'SI'}
              loadOptions={loadOptionsPlayer}
              classInput='md:col-span-3'
            />
          )
        )}

        <div className='md:col-span-6 sm:col-span-6'>
          <AlertaCard text='Selecciona el equipo prestado' />
        </div>

        {formOptions.generalFields.map(({ type, label, name, required }) => (
          <InputField
            key={name}
            type={type}
            label={label}
            name={name}
            required={required}
            value={formData[name] || ''}
            onChange={handleInputChange}
            disabled={view || formData.devuelto === 'SI'}
            loadOptions={loadOptionsEquipo}
            classInput='md:col-span-3'
          />
        ))}

        <div className='md:col-span-6 sm:col-span-6'>
          <AlertaCard text='Rellenar los datos si es que aplica' />
        </div>

        {formOptions.aplicaFields.map(({ type, label, name, required }) => (
          <InputField
            key={name}
            type={type}
            label={label}
            name={name}
            required={required}
            value={formData[name] || ''}
            onChange={handleInputChange}
            disabled={view || formData.devuelto === 'SI'}
            classInput='md:col-span-3'
          />
        ))}

        {document && (
          <>
            <div className='md:col-span-6 sm:col-span-6'>
              <AlertaCard text='¿Equipo devuelto?' />
            </div>

            <InputField
              type='select'
              label='Selecciona si ya se devolvió el equipo *'
              name='devuelto'
              required={true}
              value={formData.devuelto || ''}
              onChange={handleInputChange}
              disabled={view || formData.devuelto === 'SI'}
              opcSelect={formOptions.opcSelect}
              classInput={
                ['SI'].includes(formData.devuelto)
                  ? 'md:col-span-3'
                  : 'md:col-span-6'
              }
            />

            {formData.devuelto === 'SI' && (
              <InputField
                type='date'
                label='Fecha en la que se devolvió el equipo *'
                name='fecha_devuelto'
                required={true}
                disabled={view}
                value={formData.fecha_devuelto || ''}
                onChange={handleInputChange}
                classInput='md:col-span-3'
              />
            )}
          </>
        )}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
