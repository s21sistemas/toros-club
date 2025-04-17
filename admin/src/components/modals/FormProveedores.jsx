import { useModal } from '../../hooks/useModal'
import { formOptions } from '../../utils/formProveedoresOptions'
import { AlertaCard } from '../AlertaCard'
import { InputField } from '../InputField'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'

export const FormProveedores = () => {
  const { view, formData, handleInputChange } = useModal()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='md:col-span-6 sm:col-span-6'>
          <AlertaCard text='Proveedores' />
        </div>
        {formOptions.proveedorFields.map(({ type, label, name, required }) => (
          <InputField
            key={name}
            type={type}
            label={label}
            name={name}
            required={required}
            value={formData[name] || ''}
            onChange={handleInputChange}
            disabled={view}
            classInput='md:col-span-6'
          />
        ))}

        <div className='md:col-span-6 sm:col-span-6'>
          <AlertaCard text='Datos de contacto' />
        </div>
        {formOptions.contactoFields.map(({ type, label, name, required }) => (
          <InputField
            key={name}
            type={type}
            label={label}
            name={`datos_contacto.${name}`}
            required={required}
            value={formData.datos_contacto?.[name] || ''}
            onChange={handleInputChange}
            disabled={view}
            classInput='md:col-span-6'
          />
        ))}

        <div className='md:col-span-6 sm:col-span-6'>
          <AlertaCard text='Datos fiscales del proveedor' />
        </div>
        {formOptions.datosFiscalesField.map(
          ({ type, label, name, required }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              name={`datos_fiscales.${name}`}
              required={required}
              value={formData.datos_fiscales?.[name] || ''}
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
