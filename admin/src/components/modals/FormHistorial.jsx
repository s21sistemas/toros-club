import { useModal } from '../../hooks/useModal'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormHistorial = () => {
  const { view, formData, handleInputChange } = useModal()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <InputField
          type='select'
          label='Método de pago'
          name='metodo_pago'
          required={true}
          value={formData.metodo_pago || ''}
          onChange={handleInputChange}
          disabled={view}
          classInput='md:col-span-6'
          opcSelect={[
            { value: '', label: 'Selecciona una opción' },
            {
              value: 'transferencia bancaria',
              label: 'Transferencia bancaria'
            },
            { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'cheques', label: ' Cheques' }
          ]}
        />
      </div>

      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
