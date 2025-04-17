import { useModal } from '../../hooks/useModal'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'

export const FormCaja = () => {
  const { formData, handleInputChange } = useModal()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <InputField
          type='select'
          label='¿La coordinadora entregó el pago?'
          name='entregado'
          required={true}
          value={formData.entregado || ''}
          opcSelect={[
            { label: 'Selecciona una opción', value: '' },
            { label: 'SI', value: 'SI' },
            { label: 'NO', value: 'NO' }
          ]}
          onChange={handleInputChange}
          classInput='md:col-span-6'
        />
      </div>
      <ButtonsModal />
    </>
  )
}
