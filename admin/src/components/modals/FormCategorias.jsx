import { useCategorias } from '../../hooks/useCategorias'
import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formCategoriasOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormCategorias = () => {
  const { view, formData, handleInputChange } = useModal()
  const { loadOptionsTemporadas } = useCategorias()

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
              onChange={handleInputChange}
              disabled={view}
              loadOptions={loadOptionsTemporadas}
              opcSelect={opcSelect}
              classInput='md:col-span-3'
            />
          )
        )}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
