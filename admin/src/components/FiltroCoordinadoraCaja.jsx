import { BookmarkX, Funnel } from 'lucide-react'
import { InputField } from './InputField'
import { AlertaCard } from './AlertaCard'

export const FiltroCoordinadoraCaja = ({
  formData,
  handleInputChange,
  view,
  loadOptionsCoordinadora,
  handleFiltrar,
  handleClearFilter
}) => {
  return (
    <div className='mb-6 bg-white shadow-md rounded-md p-4'>
      <div className='mb-4'>
        <AlertaCard text='Puedes filtrar por coordinadoras y ver el dinero recibido' />
      </div>

      <div className='mb-4'>
        <InputField
          type='async'
          label='Selecciona a la coordinadora'
          name='coordinadora'
          required={true}
          value={formData.coordinadora}
          onChange={handleInputChange}
          disabled={view}
          loadOptions={loadOptionsCoordinadora}
        />
      </div>

      <div className='flex flex-col md:flex-row gap-2 items-center justify-center'>
        <button
          onClick={handleFiltrar}
          className='rounded-sm text-white font-medium py-2 px-3 bg-[#328E6E] hover:bg-[#24644e] transition-all cursor-pointer mt-4 flex items-center gap-2'
        >
          <Funnel className='w-4 h-4' />
          Filtrar coordinadoras
        </button>
        <button
          onClick={handleClearFilter}
          className='rounded-sm text-white font-medium py-2 px-3 bg-[#E78B48] hover:bg-[#c4763e] transition-all cursor-pointer mt-4 flex items-center gap-2'
        >
          <BookmarkX className='w-5 h-5' />
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}
