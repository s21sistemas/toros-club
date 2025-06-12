import { useEffect, useState } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { usePaymentPlayer } from '../hooks/usePaymentPlayer'
import { FormPaymentsPlayers } from '../components/modals/FormPaymentsPlayers'
import { FiltroPagosJugadores } from '../components/FiltroPagosJugadores'
import { useAuth } from '../hooks/useAuth'
import { CalculadoraCoaching } from '../components/CalculadoraCoaching'

const columns = [
  { key: 'inscripcion', name: 'Inscripción' },
  { key: 'tunel', name: 'Aportación' },
  { key: 'botiquin', name: 'Botiquín' },
  { key: 'coacheo', name: 'Coaching' },
  { key: 'nombre', name: 'Jugador' },
  { key: 'fecha_inscripcion', name: 'Fecha de inscripción' }
]

export default function PagosJugadoresPage() {
  const { user } = useAuth()

  const {
    modalType,
    currentItem,
    formData,
    handleInputChange,
    view,
    categoriaOptionsFilter
  } = useModal()

  const {
    payments,
    loading,
    getDataPaymentsPlayer,
    handleSubmit,
    handleDelete,
    handleFiltrar,
    handleClearFilter,
    loadOptionsTemporadas,
    handleCleanPay
  } = usePaymentPlayer(handleInputChange)

  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    const getUser = async () => {
      return await getDataPaymentsPlayer()
    }

    getUser()
  }, [getDataPaymentsPlayer])

  useEffect(() => {
    if (user?.coordinadora_jugadores) {
      const categoriasUsuario = user.categorias.map((c) =>
        c.label.toLowerCase()
      )

      const paymentFilter = payments.filter((pay) =>
        categoriasUsuario.some((cat) =>
          pay.categoria?.toLowerCase().includes(cat)
        )
      )

      setFilterData(paymentFilter)
    } else {
      setFilterData(payments)
    }
  }, [payments])

  return (
    <div className='md:p-4 bg-gray-100'>
      {!user.coordinadora_jugadores && (
        <FiltroPagosJugadores
          formData={formData}
          handleInputChange={handleInputChange}
          view={view}
          loadOptionsTemporadas={loadOptionsTemporadas}
          categoriaOptionsFilter={categoriaOptionsFilter}
          handleFiltrar={handleFiltrar}
          handleClearFilter={handleClearFilter}
        />
      )}

      <BaseTable
        columns={columns}
        data={filterData}
        title='Pagos de jugadores'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm
          handleSubmit={handleSubmit}
          Inputs={
            <FormPaymentsPlayers user={user} handleCleanPay={handleCleanPay} />
          }
        />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}

      <CalculadoraCoaching />
    </div>
  )
}
