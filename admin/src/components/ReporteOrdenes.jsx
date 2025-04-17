import { AlertaCard } from './AlertaCard'
import { FormReporteOrdenCompra } from './modals/FormReporteOrdenCompra'

export const ReporteOrdenes = () => {
  return (
    <div className='mt-6 bg-white p-4 rounded-xl mx-auto'>
      <AlertaCard text='Generarador de reporte' />

      <FormReporteOrdenCompra />
    </div>
  )
}
