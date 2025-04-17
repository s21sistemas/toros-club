import { useModal } from '../../hooks/useModal'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormModules = () => {
  const { view, formData, handleInputChange } = useModal()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <InputField
          type='text'
          label='Nombre'
          name='nombre'
          required={true}
          autofocus={true}
          value={formData.nombre || ''}
          onChange={handleInputChange}
          disabled={view}
          classInput='md:col-span-6'
        />
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
