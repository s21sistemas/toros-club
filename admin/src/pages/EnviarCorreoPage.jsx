import { AlertaCard } from '../components/AlertaCard'
import { InputField } from '../components/InputField'
import { useAlerta } from '../hooks/useAlerta'
import { useModal } from '../hooks/useModal'
import { formOptions } from '../utils/formCorreoOptions'

export default function EnviarCorreoPage() {
  const { view, formData, handleInputChange } = useModal()
  const { handleSubmit, loadOptionsAlerta } = useAlerta()

  return (
    <form className='p-4 bg-white rounded-lg' onSubmit={handleSubmit}>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='md:col-span-6 sm:col-span-6'>
          <AlertaCard text='Enviar correo' />
        </div>

        {formOptions.generalFields.map(({ type, label, name, required }) => (
          <InputField
            key={name}
            type={type}
            label={label}
            name={name}
            required={required}
            value={formData[name] || ''}
            disabled={view}
            onChange={handleInputChange}
            loadOptions={loadOptionsAlerta}
            classInput={
              ['correoId', 'asunto'].includes(name)
                ? 'md:col-span-3'
                : 'md:col-span-6'
            }
          />
        ))}
      </div>
      <div className='mt-5'>
        <button
          type='submit'
          className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm cursor-pointer transition-all'
        >
          Enviar
        </button>
      </div>
    </form>
  )
}
