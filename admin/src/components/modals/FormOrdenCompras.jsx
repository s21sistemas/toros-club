import { useModal } from '../../hooks/useModal'
import { useOrdenCompra } from '../../hooks/useOrdenCompra'
import { formOptions } from '../../utils/formOrdenCompraOptions'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormOrdenCompras = () => {
  const { view, formData, handleInputChange, handleCheckboxChange } = useModal()
  const { loadOptionsProveedores, loadOptionsArticulos, loadOptionsBancos } =
    useOrdenCompra()

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
            disabled={name === 'precio_articulo' ? true : view}
            classInput='md:col-span-3'
          />
        ))}

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
                  disabled={view}
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
