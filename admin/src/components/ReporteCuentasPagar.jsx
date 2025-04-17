import { AlertaCard } from './AlertaCard'
import { FormReporteCuentasPagar } from './modals/FormReporteCuentasPagar'

export const ReporteCuentasPagar = () => {
  return (
    <div className='mt-6 bg-white p-4 rounded-xl mx-auto'>
      <AlertaCard text='Generarador de reporte' />

      <FormReporteCuentasPagar />
    </div>
  )
}
