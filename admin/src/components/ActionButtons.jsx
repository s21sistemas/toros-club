import { Edit, Eye, FileText, Trash2 } from 'lucide-react'
import { useModal } from '../hooks/useModal'
import { useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { usePDFEquipamiento } from '../hooks/usePDFEquipamiento'
export const ActionButtons = ({ data }) => {
  const { pathname } = useLocation()
  const { openModal } = useModal()
  const { permisos } = useAuth()
  const { downloadPDFEquipamiento } = usePDFEquipamiento()

  return (
    <div className='flex justify-center space-x-2'>
      {permisos?.includes('actualizar') && pathname === '/caja' ? (
        <button
          onClick={() => openModal('edit', data)}
          className='text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 cursor-pointer transition-all'
        >
          <Edit className='h-5 w-5' />
        </button>
      ) : (
        <>
          {permisos?.includes('consultar') && (
            <button
              onClick={() => openModal('view', data)}
              className='text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 cursor-pointer transition-all'
            >
              <Eye className='h-5 w-5' />
            </button>
          )}

          {permisos?.includes('actualizar') && pathname !== '/correos' && (
            <button
              onClick={() => openModal('edit', data)}
              className='text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 cursor-pointer transition-all'
            >
              <Edit className='h-5 w-5' />
            </button>
          )}

          {permisos?.includes('eliminar') &&
            pathname !== '/cuentas-pagar' &&
            pathname !== '/correos' && (
              <button
                onClick={() => openModal('delete', data)}
                className='text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 cursor-pointer transition-all'
              >
                <Trash2 className='h-5 w-5' />
              </button>
            )}

          {pathname === '/utileria' && (
            <button
              onClick={() => downloadPDFEquipamiento(data)}
              className='text-yellow-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 cursor-pointer transition-all'
            >
              <FileText className='h-5 w-5' />
            </button>
          )}
        </>
      )}
    </div>
  )
}
