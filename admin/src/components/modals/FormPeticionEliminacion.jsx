import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formPeticionEliminacionOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormPeticionEliminacion = () => {
  const { view, formData, handleInputChange } = useModal()

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
              opcSelect={opcSelect}
              value={formData[name] || ''}
              onChange={handleInputChange}
              disabled={view}
              classInput='md:col-span-6'
            />
          )
        )}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
