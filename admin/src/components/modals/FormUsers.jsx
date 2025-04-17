import { useModal } from '../../hooks/useModal'
import { useUser } from '../../hooks/useUser'
import { CancelButtonModal } from './CancelButtonModal'
import { ButtonsModal } from './ButtonsModal'
import { formOptions } from '../../utils/formUsersOptions'
import { InputField } from '../InputField'

export const FormUsers = () => {
  const { view, formData, handleInputChange } = useModal()
  const { loadOptions } = useUser()

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
            loadOptions={loadOptions}
            document={type === 'file' && document}
            classInput='md:col-span-6'
          />
        ))}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
