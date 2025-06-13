import { useEffect, useState } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { FormPaymentsCheer } from '../components/modals/FormPaymentsCheer'
import { usePaymentCheer } from '../hooks/usePaymentCheer'
import { useAuth } from '../hooks/useAuth'
import { CalculadoraCoaching } from '../components/CalculadoraCoaching'

const columns = [
  { key: 'inscripcion', name: 'Inscripción' },
  { key: 'coacheo', name: 'Coacheo' },
  { key: 'nombre', name: 'Porrista' }
]

export default function PagosPorristasPage() {
  const { user } = useAuth()
  const { modalType, currentItem } = useModal()

  const {
    payments,
    loading,
    getDataPaymentsCheer,
    handleSubmit,
    handleDelete
  } = usePaymentCheer()

  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    const getUser = async () => {
      return await getDataPaymentsCheer()
    }

    getUser()
  }, [getDataPaymentsCheer])

  useEffect(() => {
    if (user?.coordinadora_porristas) {
      const porristas = user.porristaId.map((p) => p.value)

      const paymentFilter = payments.filter((pago) =>
        porristas.includes(pago.porristaId)
      )

      setFilterData(paymentFilter)
    } else {
      setFilterData(payments)
    }
  }, [payments])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={filterData}
        title='Pagos de porristas'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm
          handleSubmit={handleSubmit}
          Inputs={<FormPaymentsCheer user={user} />}
        />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}

      <CalculadoraCoaching />
    </div>
  )
}
