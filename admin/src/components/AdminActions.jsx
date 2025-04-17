import { Link } from 'react-router'

export const AdminActions = () => {
  return (
    <div>
      <div className='bg-white rounded-lg shadow'>
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>Acciones</h2>
        </div>
        <div className='p-4'>
          <div className='space-y-3'>
            <Link
              to='/usuarios'
              className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
            >
              Agregar usuario
            </Link>
            <Link
              to='/proveedores'
              className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700'
            >
              Agregar proveedor
            </Link>
            <Link
              to='/reportes'
              className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700'
            >
              Generar reportes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
