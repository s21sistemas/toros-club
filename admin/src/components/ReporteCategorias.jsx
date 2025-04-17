import { AlertaCard } from './AlertaCard'
import { FormReporteCategorias } from './modals/FormReporteCategorias'

export const ReporteCategorias = () => {
  return (
    <div className='mt-6 bg-white p-4 rounded-xl mx-auto'>
      <AlertaCard text='Generar reporte de jugadores por categoría' />

      <FormReporteCategorias />
    </div>
  )
}
