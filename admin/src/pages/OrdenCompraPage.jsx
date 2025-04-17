import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useOrdenCompra } from '../hooks/useOrdenCompra'
import { FormOrdenCompras } from '../components/modals/FormOrdenCompras'
import { ReporteOrdenes } from '../components/ReporteOrdenes'

const columns = [
  { key: 'proveedor', name: 'Proveedor' },
  { key: 'banco', name: 'Banco' },
  { key: 'articulo', name: 'Artículo' },
  { key: 'cantidad_articulos', name: 'Cantidad' },
  { key: 'total', name: 'Total' },
  { key: 'estatus', name: 'Estatus' },
  { key: 'fecha', name: 'Fecha de orden' }
]

export default function OrdenCompraPage() {
  const { modalType, currentItem } = useModal()

  const {
    ordenCompras,
    loading,
    getDataOrdenCompras,
    handleSubmit,
    handleDelete
  } = useOrdenCompra()

  useEffect(() => {
    const getOrdenCompra = async () => {
      return await getDataOrdenCompras()
    }

    getOrdenCompra()
  }, [getDataOrdenCompras])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={ordenCompras}
        title='Ordenes de compra'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormOrdenCompras />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}

      <ReporteOrdenes />
    </div>
  )
}
