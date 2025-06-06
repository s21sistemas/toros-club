import { BookmarkX, Funnel } from 'lucide-react'
import { InputField } from './InputField'
import { AlertaCard } from './AlertaCard'

export const FiltroPagosJugadores = ({
  formData,
  handleInputChange,
  view,
  loadOptionsTemporadas,
  categoriaOptionsFilter,
  handleFiltrar,
  handleClearFilter
}) => {
  return (
    <div className='mb-6 bg-white shadow-md rounded-md p-4'>
      <div className='mb-4'>
        <AlertaCard text='Puedes filtrar a los jugadores por temporada y categorías' />
      </div>

      <div className='mb-4'>
        <InputField
          type='async'
          label='Selecciona la temporada'
          name='temporadaIdFilter'
          required={true}
          value={formData.temporadaIdFilter}
          onChange={handleInputChange}
          disabled={view}
          loadOptions={loadOptionsTemporadas}
        />
      </div>

      {formData.temporadaIdFilter?.value && (
        <InputField
          type='select'
          label='Selecciona la categoría'
          name='categoriaFilter'
          required={true}
          value={formData.categoriaFilter}
          opcSelect={categoriaOptionsFilter}
          onChange={handleInputChange}
          disabled={view}
        />
      )}

      <div className='flex flex-col md:flex-row gap-2 items-center justify-center'>
        <button
          onClick={handleFiltrar}
          className='rounded-sm text-white font-medium py-2 px-3 bg-[#328E6E] hover:bg-[#24644e] transition-all cursor-pointer mt-4 flex items-center gap-2'
        >
          <Funnel className='w-4 h-4' />
          Filtrar jugadores
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
