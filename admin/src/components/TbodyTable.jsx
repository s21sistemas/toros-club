import { ActionButtons } from './ActionButtons'
import Loading from './Loading'
import { useAuth } from '../hooks/useAuth'

export const TbodyTable = ({
  loading,
  columns,
  currentData,
  handleClass,
  formatValue
}) => {
  const { permisos } = useAuth()

  return (
    <tbody className='bg-white divide-y divide-gray-200'>
      {loading ? (
        <tr className=''>
          <td colSpan={columns.length + 1} className='pb-10'>
            <Loading />
          </td>
        </tr>
      ) : (
        <>
          {currentData.map((item) => (
            <tr key={item.id} className='hover:bg-gray-50'>
              {columns.map((col, index) => (
                <td
                  key={col.key}
                  className='text-center px-6 py-4 whitespace-pre-line break-words'
                >
                  {index === 0 ? (
                    <div
                      className={`flex items-center gap-3 ${
                        item.foto ? 'justify-start' : 'justify-center'
                      }`}
                    >
                      {item.foto && (
                        <img
                          src={item.foto}
                          alt='Foto'
                          className='w-10 h-10 rounded-full'
                        />
                      )}

                      {[
                        'pendiente',
                        'pagado',
                        'cancelada',
                        'cancelado'
                      ].includes(item[col.key]) ? (
                        <p>
                          <span
                            className={`text-sm text-white pt-[3px] pb-[5px] px-[6px] rounded-md ${handleClass(
                              item,
                              col.key
                            )}`}
                          >
                            {item[col.key]}
                          </span>
                        </p>
                      ) : (
                        <p className='text-sm text-gray-900'>
                          {formatValue(item[col.key])}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      {[
                        'pendiente',
                        'pagado',
                        'pagada',
                        'cancelada',
                        'cancelado'
                      ].includes(item[col.key]) ? (
                        <p>
                          <span
                            className={`text-sm text-white pt-[3px] pb-[5px] px-[6px] rounded-md ${handleClass(
                              item,
                              col.key
                            )}`}
                          >
                            {item[col.key]}
                          </span>
                        </p>
                      ) : (
                        <p className='text-sm text-gray-900'>
                          {formatValue(item[col.key])}
                        </p>
                      )}
                    </>
                  )}
                </td>
              ))}
              {['consultar', 'actualizar', 'eliminar'].some((permiso) =>
                permisos?.includes(permiso)
              ) && (
                <td className='text-center px-6 py-4'>
                  <ActionButtons data={item} />
                </td>
              )}
            </tr>
          ))}
          {currentData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No se encontraron registros
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  )
}
