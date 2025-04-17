import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { FormPaymentsCheer } from '../components/modals/FormPaymentsCheer'
import { usePaymentCheer } from '../hooks/usePaymentCheer'

const columns = [
  { key: 'inscripcion', name: 'Inscripción' },
  { key: 'coacheo', name: 'Coacheo' },
  { key: 'nombre', name: 'Porrista' }
]

export default function PagosPorristasPage() {
  const { modalType, currentItem } = useModal()

  const {
    payments,
    loading,
    getDataPaymentsCheer,
    handleSubmit,
    handleDelete
  } = usePaymentCheer()

  useEffect(() => {
    const getUser = async () => {
      return await getDataPaymentsCheer()
    }

    getUser()
  }, [getDataPaymentsCheer])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={payments}
        title='Pagos de porristas'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormPaymentsCheer />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
