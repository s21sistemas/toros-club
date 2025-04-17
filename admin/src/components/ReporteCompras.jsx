import { AlertaCard } from './AlertaCard'
import { FormReporteCompras } from './modals/FormReporteCompras'

export const ReporteCompras = () => {
  return (
    <div className='mt-6 bg-white p-4 rounded-xl mx-auto'>
      <AlertaCard text='Generarador de reporte' />

      <FormReporteCompras />
    </div>
  )
}
