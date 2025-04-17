import { useAlmacen } from '../../hooks/useAlmacen'
import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formAlmacenOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormAlmacen = () => {
  const { view, formData, handleInputChange } = useModal()
  const { loadOptions } = useAlmacen()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        {formOptions.generalFields.map(({ type, label, name, required }) => (
          <InputField
            key={name}
            type={type}
            label={label}
            name={name}
            required={required}
            value={formData[name] || ''}
            onChange={handleInputChange}
            disabled={view}
            classInput='md:col-span-6'
            loadOptions={loadOptions}
          />
        ))}

        <InputField
          type='select'
          label='Tipo'
          name='tipo'
          required={true}
          value={formData.tipo || ''}
          onChange={handleInputChange}
          disabled={view}
          classInput='md:col-span-6'
          opcSelect={formOptions.opcSelect}
        />
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
