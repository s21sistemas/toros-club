import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTable } from '../hooks/useTable'

export const Pagination = () => {
  const {
    indexOfFirstItem,
    indexOfLastItem,
    filteredData,
    currentPage,
    totalPages,
    goToPage
  } = useTable()

  return (
    <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
      <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Mostrando{' '}
            <span className='font-medium'>{indexOfFirstItem + 1}</span> a{' '}
            <span className='font-medium'>
              {Math.min(indexOfLastItem, filteredData.length)}
            </span>{' '}
            de <span className='font-medium'>{filteredData.length}</span>{' '}
            resultados
          </p>
        </div>
        <div>
          <nav
            className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
            aria-label='Pagination'
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md cursor-pointer border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className='sr-only'>Anterior</span>
              <ChevronLeft className='h-5 w-5' />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`relative inline-flex items-center cursor-pointer px-4 py-2 border text-sm font-medium ${
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center cursor-pointer px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className='sr-only'>Siguiente</span>
              <ChevronRight className='h-5 w-5' />
            </button>
          </nav>
        </div>
      </div>
      <div className='flex sm:hidden justify-between w-full'>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center cursor-pointer px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === 1
              ? 'text-gray-300 bg-gray-100'
              : 'text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          Anterior
        </button>
        <p className='text-sm text-gray-700 self-center'>
          {currentPage} de {totalPages}
        </p>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-4 py-2 cursor-pointer border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === totalPages
              ? 'text-gray-300 bg-gray-100'
              : 'text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
