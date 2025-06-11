import dayjs from 'dayjs'
import { Calendar, CreditCard, DollarSign } from 'lucide-react'

export const CardHistorialPagosCoaching = ({ pago }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 md:col-span-2'>
      <div className='bg-gray-50 p-4 rounded-lg'>
        <div className='flex items-center justify-center space-x-4'>
          <Calendar className='h-6 w-6 mt-0.5 text-purple-500' />
          <p className='text-lg font-medium text-gray-800'>
            {dayjs(pago.fecha_inicial, 'YYYY-MM-DD').format('DD/MM/YYYY')}
          </p>
        </div>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg'>
        <div className='flex items-center justify-center space-x-4'>
          <DollarSign className='h-6 w-6 mt-0.5 text-green-500' />
          <p className='text-2xl font-bold text-gray-800'>
            {pago.total_pagado} MXN
          </p>
        </div>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg'>
        <div className='flex items-center justify-center space-x-4'>
          <Calendar className='h-6 w-6 mt-0.5 text-purple-500' />
          <p className='text-lg font-medium text-gray-800'>
            {dayjs(pago.fecha_final, 'YYYY-MM-DD').format('DD/MM/YYYY')}
          </p>
        </div>
      </div>
    </div>
  )
}
