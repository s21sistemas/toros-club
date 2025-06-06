import { useModal } from '../../hooks/useModal'
import { useUser } from '../../hooks/useUser'
import { CancelButtonModal } from './CancelButtonModal'
import { ButtonsModal } from './ButtonsModal'
import { formOptions } from '../../utils/formUsersOptions'
import { InputField } from '../InputField'

export const FormUsers = () => {
  const {
    view,
    formData,
    handleInputChange,
    handleCheckboxChange,
    loadOptionsCategorias
  } = useModal()
  const { loadOptions, loadOptionsTemporadas, loadOptionsPorristas } = useUser()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        {formOptions.generalFields.map(({ type, label, name, required }) => (
          <InputField
            key={name}
            type={type}
            label={label}
            name={name}
            required={required}
            value={formData[name] || ''}
            onChange={handleInputChange}
            disabled={view}
            loadOptions={loadOptions}
            document={type === 'file' && document}
            classInput='md:col-span-6'
          />
        ))}

        <div className='sm:col-span-6 md:col-span-6'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              name='coordinadora_jugadores'
              checked={formData.coordinadora_jugadores || false}
              onChange={handleCheckboxChange}
              className='sr-only peer outline-0'
              disabled={view}
            />
            <div className="relative w-9 h-5 bg-gray-500 cursor-pointer peer-disabled:bg-gray-300 peer-disabled:cursor-auto peer-focus:outline-0 outline-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            <span className='ms-3 text-sm font-medium text-gray-900'>
              ¿Es coordinadora de jugadores?
            </span>
          </label>
        </div>

        {formData.coordinadora_jugadores &&
          formOptions.coordinadoraJugadoresFields.map(
            ({ type, label, name, required }) => (
              <InputField
                key={name}
                type={type}
                label={label}
                name={name}
                required={required}
                value={formData[name] || ''}
                onChange={handleInputChange}
                disabled={view}
                loadOptions={
                  name === 'categorias'
                    ? loadOptionsCategorias
                    : loadOptionsTemporadas
                }
                classInput='md:col-span-6'
                inputKey={
                  name === 'categorias'
                    ? formData.temporadaId?.value || formData.temporadaId
                    : name
                }
              />
            )
          )}

        <div className='sm:col-span-6 md:col-span-6'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              name='coordinadora_porristas'
              checked={formData.coordinadora_porristas || false}
              onChange={handleCheckboxChange}
              className='sr-only peer outline-0'
              disabled={view}
            />
            <div className="relative w-9 h-5 bg-gray-500 cursor-pointer peer-disabled:bg-gray-300 peer-disabled:cursor-auto peer-focus:outline-0 outline-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            <span className='ms-3 text-sm font-medium text-gray-900'>
              ¿Es coordinadora de porristas?
            </span>
          </label>
        </div>

        {formData.coordinadora_porristas &&
          formOptions.coordinadoraPorristasFields.map(
            ({ type, label, name, required }) => (
              <InputField
                key={name}
                type={type}
                label={label}
                name={name}
                required={required}
                value={formData[name] || ''}
                onChange={handleInputChange}
                disabled={view}
                loadOptions={
                  name === 'temporadaId'
                    ? loadOptionsTemporadas
                    : loadOptionsPorristas
                }
                classInput='md:col-span-6'
              />
            )
          )}
      </div>
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
