import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useCompras } from '../hooks/useCompras'
import { FormCompras } from '../components/modals/FormCompras'
import { ReporteCompras } from '../components/ReporteCompras'

const columns = [
  { key: 'proveedor', name: 'Proveedor' },
  { key: 'articulo', name: 'Artículo' },
  { key: 'total', name: 'Total' },
  { key: 'concepto', name: 'Concepto' },
  { key: 'metodo_pago', name: 'Método de pago' },
  { key: 'banco', name: 'Banco' },
  { key: 'fecha', name: 'Fecha' }
]

export default function ComprasPage() {
  const { modalType, currentItem } = useModal()

  const { compras, loading, getDataCompras, handleSubmit, handleDelete } =
    useCompras()

  useEffect(() => {
    const getCompras = async () => {
      return await getDataCompras()
    }

    getCompras()
  }, [getDataCompras])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={compras}
        title='Compras de artículos'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormCompras />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}

      <ReporteCompras />
    </div>
  )
}
