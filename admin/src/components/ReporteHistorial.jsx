import { AlertaCard } from './AlertaCard'
import { FormReporteHistorial } from './modals/FormReporteHistorial'

export const ReporteHistorial = () => {
  return (
    <div className='mt-6 bg-white p-4 rounded-xl mx-auto'>
      <AlertaCard text='Generar reporte del historial de pagos' />

      <FormReporteHistorial />
    </div>
  )
}
