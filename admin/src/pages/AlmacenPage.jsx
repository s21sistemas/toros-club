import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useAlmacen } from '../hooks/useAlmacen'
import { FormAlmacen } from '../components/modals/FormAlmacen'

const columns = [
  { key: 'articulo', name: 'Nombre' },
  { key: 'stock', name: 'Stock' },
  { key: 'tipo', name: 'Tipo' },
  { key: 'concepto', name: 'Concepto' },
  { key: 'fecha', name: 'Fecha' }
]

export default function AlmacenPage() {
  const { modalType, currentItem } = useModal()

  const { almacen, loading, getDataAlmacen, handleSubmit, handleDelete } =
    useAlmacen()

  useEffect(() => {
    const getAlmacen = async () => {
      return await getDataAlmacen()
    }

    getAlmacen()
  }, [getDataAlmacen])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={almacen}
        title='Almacen'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormAlmacen />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
