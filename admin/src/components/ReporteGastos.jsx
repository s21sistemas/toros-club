import { AlertaCard } from './AlertaCard'
import { FormReporteGastos } from './modals/FormReporteGastos'

export const ReporteGastos = () => {
  return (
    <div className='mt-6 bg-white p-4 rounded-xl mx-auto'>
      <AlertaCard text='Generarador de reporte' />

      <FormReporteGastos />
    </div>
  )
}
