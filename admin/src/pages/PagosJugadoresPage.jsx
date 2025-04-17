import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { usePaymentPlayer } from '../hooks/usePaymentPlayer'
import { FormPaymentsPlayers } from '../components/modals/FormPaymentsPlayers'

const columns = [
  { key: 'inscripcion', name: 'Inscripción' },
  { key: 'tunel', name: 'Túnel' },
  { key: 'botiquin', name: 'Botiquín' },
  { key: 'coacheo', name: 'Coaching' },
  { key: 'nombre', name: 'Jugador' }
]

export default function PagosJugadoresPage() {
  const { modalType, currentItem } = useModal()

  const {
    payments,
    loading,
    getDataPaymentsPlayer,
    handleSubmit,
    handleDelete
  } = usePaymentPlayer()

  useEffect(() => {
    const getUser = async () => {
      return await getDataPaymentsPlayer()
    }

    getUser()
  }, [getDataPaymentsPlayer])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={payments}
        title='Pagos de jugadores'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm
          handleSubmit={handleSubmit}
          Inputs={<FormPaymentsPlayers />}
        />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
