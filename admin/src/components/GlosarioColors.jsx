export const GlosarioColors = () => {
  return (
    <div className='flex justify-center mb-6'>
      <div className='bg-white rounded-md shadow p-3 flex items-start flex-col md:flex-row gap-2 w-[100%] sm:w-[80%] md:w-[100%] md:items-center md:justify-around'>
        <div className='flex gap-2 items-center'>
          <div className='w-5 h-5 bg-green-700 rounded-full'></div>
          <p className='text-sm'>Está pagado.</p>
        </div>
        <div className='flex gap-2 items-center'>
          <div className='w-5 h-5 bg-[#e89b0b] rounded-full'></div>
          <p className='text-sm'>
            Está pendiente pero dentro del rango de fechas.
          </p>
        </div>
        <div className='flex gap-2 items-center'>
          <div className='w-5 h-5 bg-red-600/80 rounded-full'></div>
          <p className='text-sm'>Está pendiente y/o pasó la fecha limite.</p>
        </div>
      </div>
    </div>
  )
}
