import { useReports } from '../../hooks/useReports'
import { InputField } from '../InputField'

export const FormReporteHistorial = () => {
  const {
    generarReporteHistorialPagos,
    handleInputChange,
    formReport,
    loadOptionsCoordinadora
  } = useReports()

  const handleSubmit = (e) => {
    e.preventDefault()

    generarReporteHistorialPagos(formReport)
  }

  return (
    <form
      className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mt-3'
      onSubmit={handleSubmit}
    >
      <InputField
        label='Fecha inicio'
        id='fecha_inicio'
        name='fecha_inicio'
        type='datetime-local'
        required={true}
        value={formReport.fecha_inicio}
        onChange={handleInputChange}
        classInput='md:col-span-3'
      />
      <InputField
        label='Fecha fin'
        id='fecha_fin'
        name='fecha_fin'
        type='datetime-local'
        required={true}
        value={formReport.fecha_fin}
        onChange={handleInputChange}
        classInput='md:col-span-3'
      />

      <InputField
        label='Selecciona el método de pago'
        id='metodo_pago'
        name='metodo_pago'
        type='select'
        required={true}
        value={formReport.metodo_pago}
        onChange={handleInputChange}
        opcSelect={[
          { value: '', label: 'Selecciona una opción' },
          { value: 'todos', label: 'Todos' },
          {
            value: 'transferencia bancaria',
            label: 'Transferencia bancaria'
          },
          { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
          { value: 'efectivo', label: 'Efectivo' },
          { value: 'cheques', label: ' Cheques' }
        ]}
        classInput='md:col-span-3'
      />

      <InputField
        type='async'
        label='Selecciona a la coordinadora'
        name='coordinadora'
        required={true}
        value={formReport.coordinadora}
        onChange={handleInputChange}
        loadOptions={loadOptionsCoordinadora}
        classInput='md:col-span-3'
      />

      <div className='md:col-span-6 sm:col-span-6'>
        <button className='rounded-sm text-white font-medium py-2 px-3 bg-[#3674B5] hover:bg-[#486483] transition-all cursor-pointer'>
          Generar reporte
        </button>
      </div>
    </form>
  )
}
