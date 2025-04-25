import { useCostosPorristas } from '../../hooks/useCostosPorristas'
import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formCostosPorristasOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormCostosPorristas = () => {
  const { view, formData, handleInputChange } = useModal()
  const { loadOptionsTemporadas } = useCostosPorristas()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        {formOptions.generalFields.map(
          ({ type, label, name, required, step }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              name={name}
              required={required}
              step={step}
              value={formData[name] || ''}
              onChange={handleInputChange}
              disabled={view}
              loadOptions={loadOptionsTemporadas}
              classInput='md:col-span-6'
            />
          )
        )}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
