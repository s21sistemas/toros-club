import { useReports } from '../../hooks/useReports'
import { InputField } from '../InputField'

export const FormReporteCategorias = () => {
  const {
    generarReporteJugadoresTempCat,
    loadOptionsTemporadas,
    formReport,
    handleInputChange,
    categoriaOptions
  } = useReports()

  const handleSubmit = (e) => {
    e.preventDefault()

    generarReporteJugadoresTempCat(formReport)
  }

  return (
    <form
      className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mt-3'
      onSubmit={handleSubmit}
    >
      <InputField
        label='Temporada'
        id='temporadaId'
        name='temporadaId'
        type='async'
        required={true}
        value={formReport.temporadaId}
        onChange={handleInputChange}
        loadOptions={loadOptionsTemporadas}
        classInput={
          ['todas', undefined].includes(formReport.temporadaId?.value)
            ? 'md:col-span-6'
            : 'md:col-span-3'
        }
      />

      {formReport.temporadaId?.value !== 'todas' &&
        formReport.temporadaId?.value !== undefined && (
          <InputField
            type='select'
            label='Selecciona la categoría'
            name='categoria'
            required={true}
            value={formReport.categoria}
            opcSelect={categoriaOptions}
            onChange={handleInputChange}
            classInput='md:col-span-3'
          />
        )}

      <div className='md:col-span-6 sm:col-span-6'>
        <button className='rounded-sm text-white font-medium py-2 px-3 bg-[#3674B5] hover:bg-[#486483] transition-all cursor-pointer'>
          Generar reporte
        </button>
      </div>
    </form>
  )
}
