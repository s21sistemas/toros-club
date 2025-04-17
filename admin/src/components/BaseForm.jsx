import { useModal } from '../hooks/useModal'

export const BaseForm = ({ handleSubmit, Inputs }) => {
  const { view, add, closeModal } = useModal()

  return (
    <div
      className='fixed inset-0 z-50 overflow-y-auto'
      aria-labelledby='modal-title'
      ocupacion='dialog'
      aria-modal='true'
    >
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center'>
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
        <div className='lg:max-w-[70%] md:max-w-[80%] sm:max-w-[90%] w-full inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-2xl'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                <h3
                  className='text-lg leading-6 font-medium text-gray-900 mb-3'
                  id='modal-title'
                >
                  {add
                    ? 'Agregar registro'
                    : view
                    ? 'Ver registro'
                    : 'Editar registro'}
                </h3>
                <hr className='text-gray-300' />
                <div className='mt-4'>
                  <form onSubmit={handleSubmit}>{Inputs}</form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
