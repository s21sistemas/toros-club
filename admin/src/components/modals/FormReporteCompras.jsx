import { useReports } from '../../hooks/useReports'
import { InputField } from '../InputField'

export const FormReporteCompras = () => {
  const {
    generarReporteCompras,
    loadOptionsBancos,
    loadOptionsProveedor,
    handleInputChange,
    formReport
  } = useReports()

  const handleSubmit = (e) => {
    e.preventDefault()

    generarReporteCompras(formReport)
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
        type='date'
        required={true}
        value={formReport.fecha_inicio}
        onChange={handleInputChange}
        classInput='md:col-span-3'
      />
      <InputField
        label='Fecha fin'
        id='fecha_fin'
        name='fecha_fin'
        type='date'
        required={true}
        value={formReport.fecha_fin}
        onChange={handleInputChange}
        classInput='md:col-span-3'
      />
      <InputField
        label='Bancos'
        id='bancoId'
        name='bancoId'
        type='async'
        required={true}
        value={formReport.bancoId}
        onChange={handleInputChange}
        loadOptions={loadOptionsBancos}
        classInput='md:col-span-3'
      />
      <InputField
        label='Proveedor'
        id='proveedorId'
        name='proveedorId'
        type='async'
        required={true}
        value={formReport.proveedorId}
        onChange={handleInputChange}
        loadOptions={loadOptionsProveedor}
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
        classInput='md:col-span-6'
      />

      <div className='md:col-span-6 sm:col-span-6'>
        <button className='rounded-sm text-white font-medium py-2 px-3 bg-[#3674B5] hover:bg-[#486483] transition-all cursor-pointer'>
          Generar reporte
        </button>
      </div>
    </form>
  )
}
