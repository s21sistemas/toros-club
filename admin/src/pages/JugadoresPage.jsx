import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { useModal } from '../hooks/useModal'
import { usePlayer } from '../hooks/usePlayer'
import { ModalDelete } from '../components/ModalDelete'
import { FormPlayers } from '../components/modals/FormPlayers'

const columns = [
  { key: 'nombre_completo', name: 'Nombre' },
  { key: 'curp', name: 'CURP' },
  { key: 'numero_mfl', name: 'MFL' },
  { key: 'tipo_inscripcion', name: 'Tipo de inscripción' },
  { key: 'categoria', name: 'Categoría' }
]

const JugadoresPage = () => {
  const { modalType, currentItem } = useModal()

  const { players, loading, getDataPlayers, handleSubmit, handleDelete } =
    usePlayer()

  useEffect(() => {
    const getPlayer = async () => {
      return await getDataPlayers()
    }

    getPlayer()
  }, [getDataPlayers])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={players}
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
