import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useGastos } from '../hooks/useGastos'
import { FormGastos } from '../components/modals/FormGastos'
import { ReporteGastos } from '../components/ReporteGastos'

const columns = [
  { key: 'banco', name: 'Banco' },
  { key: 'concepto', name: 'Concepto' },
  { key: 'metodo_pago', name: 'Método de pago' },
  { key: 'total', name: 'Total (MXN)' },
  { key: 'fecha', name: 'Fecha' }
]

export default function GastosPage() {
  const { modalType, currentItem } = useModal()

  const { gastos, loading, getDataGastos, handleSubmit, handleDelete } =
    useGastos()

  useEffect(() => {
    const getGastos = async () => {
      return await getDataGastos()
    }

    getGastos()
  }, [getDataGastos])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={gastos}
        title='Gastos'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormGastos />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}

      <ReporteGastos />
    </div>
  )
}
