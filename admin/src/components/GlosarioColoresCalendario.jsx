export const GlosarioColoresCalendario = () => {
  return (
    <div className='flex justify-center mb-6'>
      <div className='bg-white rounded-md shadow p-3 flex items-start flex-col md:flex-row gap-2 w-[100%] sm:w-[80%] md:w-[100%] md:items-center md:justify-around'>
        <div className='flex gap-2 items-center'>
          <div className='w-5 h-5 bg-red-600/80 rounded-sm'></div>
          <p className='text-sm'>Pendiente inscripción y coaching.</p>
        </div>
        <div className='flex gap-2 items-center'>
          <div className='w-5 h-5 bg-green-700 rounded-sm'></div>
          <p className='text-sm'>Pagos al día.</p>
        </div>

        <div className='flex gap-2 items-center'>
          <div className='w-5 h-5 bg-[linear-gradient(to_right,_#dc2626_0%,_#f87171_33%,_#4ade80_66%,_#16a34a_100%)] rounded-sm'></div>
          <p className='text-sm'>
            Inscripción pendiente, pero coaching al día.
          </p>
        </div>
        <div className='flex gap-2 items-center'>
          <div className='w-5 h-5 bg-[linear-gradient(to_right,_#16a34a_0%,_#4ade80_33%,_#f87171_66%,_#dc2626_100%)] rounded-sm'></div>
          <p className='text-sm'>
            Inscripción pagada, pero coaching pendiente.
          </p>
        </div>
      </div>
    </div>
  )
}
