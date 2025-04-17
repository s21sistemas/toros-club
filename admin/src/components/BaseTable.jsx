import { useLocation } from 'react-router'
import { useEffect } from 'react'
import { useTable } from '../hooks/useTable'
import { Pagination } from './Pagination'
import { SearchBar } from './SearchBar'
import { GlosarioColors } from './GlosarioColors'
import { TheadTable } from './TheadTable'
import { TbodyTable } from './TbodyTable'

export const BaseTable = ({ columns, data, title, loading }) => {
  const location = useLocation()
  const { currentData, setData, handleClass, formatValue } = useTable()

  useEffect(() => {
    setData(
      data,
      columns.map((col) => col.key)
    )
  }, [data, columns, setData])

  return (
    <>
      {(location.pathname === '/pagos-jugadores' ||
        location.pathname === '/pagos-porristas') && <GlosarioColors />}

      <SearchBar title={title} />

      <div className='bg-white shadow rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <TheadTable columns={columns} />
            <TbodyTable
              loading={loading}
              columns={columns}
              currentData={currentData}
              handleClass={handleClass}
              formatValue={formatValue}
            />
          </table>
        </div>

        <Pagination />
      </div>
    </>
  )
}
