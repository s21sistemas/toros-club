import { AlertaCard } from './AlertaCard'
import { FormReporteBancos } from './modals/FormReporteBancos'

export const ReporteBancos = () => {
  return (
    <div className='mt-6 bg-white p-4 rounded-xl mx-auto'>
      <AlertaCard text='Generar reporte de bancos' />

      <FormReporteBancos />
    </div>
  )
}
