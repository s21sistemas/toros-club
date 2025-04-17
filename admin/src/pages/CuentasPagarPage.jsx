import { useEffect } from 'react'
import { BaseTable } from '../components/BaseTable'
import { useCuentasPagar } from '../hooks/useCuentasPagar'
import { useModal } from '../hooks/useModal'
import { BaseForm } from '../components/BaseForm'
import { FormCuentasPagar } from '../components/modals/FormCuentasPagar'
import { ReporteCuentasPagar } from '../components/ReporteCuentasPagar'

const columns = [
  { key: 'proveedor', name: 'Proveedor' },
  { key: 'banco', name: 'Banco' },
  { key: 'articulo', name: 'Artículo' },
  { key: 'cantidad_articulos', name: 'Cantidad' },
  { key: 'total', name: 'Total' },
  { key: 'estatus', name: 'Estatus' },
  { key: 'fecha', name: 'Fecha de orden' }
]

export default function CuentasPagarPage() {
  const { modalType } = useModal()
  const { cuentasPagar, loading, getDataCuentasPagar, handleSubmit } =
    useCuentasPagar()

  useEffect(() => {
    const getCuentasPagar = async () => {
      return await getDataCuentasPagar()
    }

    getCuentasPagar()
  }, [getDataCuentasPagar])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={cuentasPagar}
        title='Cuentas a pagar'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormCuentasPagar />} />
      )}

      <ReporteCuentasPagar />
    </div>
  )
}
