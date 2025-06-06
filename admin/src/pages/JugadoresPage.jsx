import { useEffect, useState } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { useModal } from '../hooks/useModal'
import { usePlayer } from '../hooks/usePlayer'
import { ModalDelete } from '../components/ModalDelete'
import { FormPlayers } from '../components/modals/FormPlayers'
import { useAuth } from '../hooks/useAuth'

const columns = [
  { key: 'nombre_completo', name: 'Nombre' },
  { key: 'curp', name: 'CURP' },
  { key: 'numero_mfl', name: 'MFL' },
  { key: 'tipo_inscripcion', name: 'Tipo de inscripción' },
  { key: 'categoria', name: 'Categoría' }
]

const JugadoresPage = () => {
  const { user } = useAuth()
  const { modalType, currentItem } = useModal()

  const { players, loading, getDataPlayers, handleSubmit, handleDelete } =
    usePlayer()

  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    const getPlayer = async () => {
      return await getDataPlayers()
    }

    getPlayer()
  }, [getDataPlayers])

  useEffect(() => {
    if (user?.coordinadora_jugadores) {
      const categoriasUsuario = user.categorias.map((c) =>
        c.label.toLowerCase()
      )

      const playersFilter = players.filter((pay) =>
        categoriasUsuario.some((cat) =>
          pay.categoria?.toLowerCase().includes(cat)
        )
      )

      setFilterData(playersFilter)
    } else {
      setFilterData(players)
    }
  }, [players])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={filterData}
        title='Jugadores'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormPlayers />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
export default JugadoresPage
