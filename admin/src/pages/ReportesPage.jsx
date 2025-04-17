import { useReports } from '../hooks/useReports'

export default function ReportesPage() {
  const {
    generarReporteAlmacen,
    generarReporteTransferencia,
    generarReporteNovatos,
    generarReportePagos,
    generarReportePagosCoaching,
    generarReporteEquipamiento
  } = useReports()

  return (
    <div className='md:p-4 bg-gray-100'>
      <h1 className='text-4xl font-bold mb-10 text-center'>Generar reportes</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <button
          onClick={generarReporteAlmacen}
          className='bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 cursor-pointer'
        >
          Reportes por almacén
        </button>

        <button
          onClick={generarReporteTransferencia}
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer'
        >
          Reporte de jugadores por transferencia
        </button>

        <button
          onClick={generarReporteNovatos}
          className='bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer'
        >
          Reporte de jugadores novatos
        </button>

        <button
          onClick={generarReportePagos}
          className='bg-amber-600 hover:bg-amber-700 text-white font-medium py-4 px-6 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 cursor-pointer'
        >
          Reporte de pagos pendientes
        </button>

        <button
          onClick={generarReportePagosCoaching}
          className='bg-teal-600 hover:bg-teal-700 text-white font-medium py-4 px-6 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 cursor-pointer'
        >
          Reporte de pagos pendientes de coaching
        </button>

        <button
          onClick={generarReporteEquipamiento}
          className='bg-rose-600 hover:bg-rose-700 text-white font-medium py-4 px-6 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 cursor-pointer'
        >
          Reporte de equipamiento prestado
        </button>
      </div>
    </div>
  )
}
