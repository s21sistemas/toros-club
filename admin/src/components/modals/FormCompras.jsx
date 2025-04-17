import { useCompras } from '../../hooks/useCompras'
import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formComprasOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormCompras = () => {
  const { view, formData, handleInputChange, handleCheckboxChange } = useModal()
  const { loadOptionsProveedores, loadOptionsArticulos, loadOptionsBancos } =
    useCompras()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='sm:col-span-6 md:col-span-6 flex'>
          <InputField
            type='checkbox'
            label='¿Con IVA?'
            name='iva'
            required={false}
            value={formData.iva || false}
            onChange={handleCheckboxChange}
            disabled={view}
          />
        </div>

        {formOptions.generalFields.map(({ type, label, name, required }) => (
          <InputField
            key={name}
            type={type}
            label={label}
            name={name}
            required={required}
            value={formData[name] || ''}
            onChange={handleInputChange}
            loadOptions={
              type === 'async'
                ? name === 'proveedorId'
                  ? loadOptionsProveedores
                  : name === 'articuloId'
                  ? loadOptionsArticulos
                  : loadOptionsBancos
                : () => {}
            }
            disabled={['precio_articulo'].includes(name) ? true : view}
            classInput='md:col-span-3'
          />
        ))}

        <InputField
          type='select'
          label='Método de pago'
          name='metodo_pago'
          required={true}
          value={formData.metodo_pago || ''}
          onChange={handleInputChange}
          disabled={view}
          classInput='md:col-span-3'
          opcSelect={formOptions.opcSelectMetodo}
        />

        {formData.iva
          ? formOptions.totalConIvaFields.map(
              ({ type, label, name, required }) => (
                <InputField
                  key={name}
                  type={type}
                  label={label}
                  name={name}
                  required={required}
                  value={formData[name] || false}
                  onChange={handleInputChange}
                  disabled={['subtotal', 'total'].includes(name) ? true : view}
                  classInput='md:col-span-3'
                />
              )
            )
          : formOptions.totalSinIvaFields.map(
              ({ type, label, name, required }) => (
                <InputField
                  key={name}
                  type={type}
                  label={label}
                  name={name}
                  required={required}
                  value={formData[name] || false}
                  onChange={handleInputChange}
                  disabled={view}
                  classInput='md:col-span-3'
                />
              )
            )}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
