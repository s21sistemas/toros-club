import { useAuth } from '../hooks/useAuth'

export const TheadTable = ({ columns }) => {
  const { permisos } = useAuth()

  return (
    <thead className='bg-gray-50'>
      <tr>
        {columns.map((column) => (
          <th
            scope='col'
            className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
            key={column.key}
          >
            {column.name}
          </th>
        ))}
        {['consultar', 'actualizar', 'eliminar'].some((permiso) =>
          permisos?.includes(permiso)
        ) && (
          <th
            scope='col'
            className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
          >
            Acciones
          </th>
        )}
      </tr>
    </thead>
  )
}
