import { useModal } from '../../hooks/useModal'
import { useModule } from '../../hooks/useModule'
import { CancelButtonModal } from './CancelButtonModal'
import { ButtonsModal } from './ButtonsModal'
import { formOptions } from '../../utils/formRolesOptions'
import { InputField } from '../InputField'

export const FormRoles = () => {
  const { view, formData, handleInputChange } = useModal()
  const { loadOptions } = useModule()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        {formOptions.generalFields.map(
          ({ type, label, name, opcSelect, required }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              name={name}
              required={required}
              opcSelect={opcSelect}
              value={formData[name] || ''}
              onChange={handleInputChange}
              disabled={view}
              classInput='md:col-span-6'
              loadOptions={
                type === 'async' || type === 'async-multi'
                  ? loadOptions
                  : () => {}
              }
            />
          )
        )}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
