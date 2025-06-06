import { useModal } from '../../hooks/useModal'
import { useTallas } from '../../hooks/useTallas'
import { formOptions } from '../../utils/formTallasOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormTallas = () => {
  const { view, formData, handleInputChange } = useModal()
  const { loadOptionsJugadores } = useTallas()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        {formOptions.generalFields.map(
          ({ type, label, name, required, opcSelect }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              name={name}
              required={required}
              value={formData[name] || ''}
              opcSelect={opcSelect}
              onChange={handleInputChange}
              loadOptions={loadOptionsJugadores}
              disabled={view}
              classInput='md:col-span-6'
            />
          )
        )}

        {formData.tipo_categoria === 'Equipado' && (
          <>
            <InputField
              type='text'
              label='Talla de Jersey'
              name='talla_jersey'
              required={true}
              value={formData.talla_jersey || ''}
              onChange={handleInputChange}
              disabled={view}
              classInput='md:col-span-3'
            />
            <InputField
              type='text'
              label='Talla de Funda'
              name='talla_funda'
              required={true}
              value={formData.talla_funda || ''}
              onChange={handleInputChange}
              disabled={view}
              classInput='md:col-span-3'
            />
          </>
        )}

        {formData.tipo_categoria === 'Flag' && (
          <>
            <InputField
              type='text'
              label='Talla de Playera/Blusa'
              name='talla_playera_blusa'
              required={true}
              value={formData.talla_playera_blusa || ''}
              onChange={handleInputChange}
              disabled={view}
              classInput='md:col-span-3'
            />
            <InputField
              type='text'
              label='Talla de Short/Leggins'
              name='talla_short_leggins'
              required={true}
              value={formData.talla_short_leggins || ''}
              onChange={handleInputChange}
              disabled={view}
              classInput='md:col-span-3'
            />
          </>
        )}
      </div>

      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
