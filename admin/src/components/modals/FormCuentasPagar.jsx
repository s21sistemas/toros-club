import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formCuentasPagarOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormCuentasPagar = () => {
  const { view, formData, handleInputChange } = useModal()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <InputField
          type='select'
          label='Estatus de la orden'
          name='estatus'
          required={true}
          value={formData.estatus || ''}
          onChange={handleInputChange}
          disabled={view}
          classInput='md:col-span-6'
          opcSelect={formOptions.opcSelectPago}
        />

        {formData.estatus === 'pagada' && (
          <>
            <InputField
              type='select'
              label='Método de pago'
              name='metodo_pago'
              required={true}
              value={formData.metodo_pago || ''}
              onChange={handleInputChange}
              disabled={view}
              classInput='md:col-span-6'
              opcSelect={formOptions.opcSelectMetodo}
            />

            <InputField
              type='text'
              label='Total a pagar'
              name='total'
              required={true}
              value={formData.total || ''}
              onChange={handleInputChange}
              disabled={true}
              classInput='md:col-span-6'
            />
          </>
        )}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
