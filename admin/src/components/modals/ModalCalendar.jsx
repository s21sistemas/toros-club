import { Calendar, NotebookText, SquareUser } from 'lucide-react'
import { Link } from 'react-router'

export const ModalCalendar = ({ closeModal, info }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pagado':
        return 'bg-green-100 text-green-800'
      case 'pendiente':
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 overflow-y-auto'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div className='flex items-end justify-start md:justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 bg-black opacity-40 transition-opacity'
          aria-hidden='true'
          onClick={closeModal}
        ></div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='md:max-w-[70%] inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-2xl'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                <h3
                  className='text-lg leading-6 font-medium text-gray-900 mb-3'
                  id='modal-title'
                >
                  Datos de {info.nombre}
                </h3>
                <hr className='text-gray-300' />
                <div className='mt-4'>
                  <div
                    className={`border border-gray-200 shadow-sm mb-6 md:w-[40%] mx-auto ${
                      info.restringir ? 'bg-red-100' : 'bg-green-100'
                    }`}
                  >
                    <div className='p-4 text-center'>
                      <>
                        {info.restringir ? (
                          <p className='font-medium text-red-800'>
                            No tienes acceso a entrenar ya que no ha pagado en 2
                            semanas el coaching.
                          </p>
                        ) : (
                          <p className='text-lg font-medium text-green-800'>
                            Tiene acceso a entrenar
                          </p>
                        )}
                      </>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='border border-gray-200 shadow-sm'>
                      <div className='p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Calendar className='h-5 w-5 text-blue-500' />
                          <h4 className='font-medium text-gray-700'>
                            Fecha de pago de Inscripción
                          </h4>
                        </div>
                        <p className='text-lg font-semibold text-gray-900'>
                          {info.pago_ins}
                        </p>
                      </div>
                    </div>

                    <div className='border border-gray-200 shadow-sm'>
                      <div className='p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                          <NotebookText className='h-5 w-5 text-blue-500' />
                          <h4 className='font-medium text-gray-700'>
                            Pago de inscripción
                          </h4>
                        </div>
                        <span
                          className={`${getStatusColor(
                            info.ins
                          )} px-3 py-[1px] rounded-lg font-semibold`}
                        >
                          {info.ins.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className='border border-gray-200 shadow-sm'>
                      <div className='p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Calendar className='h-5 w-5 text-blue-500' />
                          <h4 className='font-medium text-gray-700'>
                            Fecha del último pago de Coaching
                          </h4>
                        </div>
                        <p className='text-lg font-semibold text-gray-900'>
                          {info.pago_coach}
                        </p>
                      </div>
                    </div>

                    <div className='border border-gray-200 shadow-sm'>
                      <div className='p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                          <SquareUser className='h-5 w-5 text-blue-500' />
                          <h4 className='font-medium text-gray-700'>
                            Pago de coaching
                          </h4>
                        </div>
                        <span
                          className={`${getStatusColor(
                            info.coach
                          )} px-3 py-[1px] rounded-lg font-semibold`}
                        >
                          {info.coach.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className='border border-gray-200 shadow-sm'>
                      <div className='p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Calendar className='h-5 w-5 text-blue-500' />
                          <h4 className='font-medium text-gray-700'>
                            Fecha limte de pago de inscripción
                          </h4>
                        </div>
                        <p className='text-lg font-semibold text-gray-900'>
                          {info.limite_ins}
                        </p>
                      </div>
                    </div>

                    <div className='border border-gray-200 shadow-sm'>
                      <div className='p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Calendar className='h-5 w-5 text-blue-500' />
                          <h4 className='font-medium text-gray-700'>
                            Fecha limite de pago de Coaching
                          </h4>
                        </div>
                        <p className='text-lg font-semibold text-gray-900'>
                          {info.limite_coach}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense'>
                  <Link
                    to={info.url}
                    className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm cursor-pointer transition-all'
                  >
                    Ir a sus pagos
                  </Link>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm cursor-pointer transition-all'
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
