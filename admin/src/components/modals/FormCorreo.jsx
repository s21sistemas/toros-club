import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formCorreoOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormCorreo = () => {
  const { view, formData } = useModal()

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
            disabled={view}
            classInput={
              ['correoId', 'asunto'].includes(name)
                ? 'md:col-span-3'
                : 'md:col-span-6'
            }
          />
        ))}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
