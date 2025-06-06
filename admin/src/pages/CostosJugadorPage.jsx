import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useCostosJugadores } from '../hooks/useCostosJugadores'
import { FormCostosJugadores } from '../components/modals/FormCostosJugadores'

const columns = [
  { key: 'temporada', name: 'Temporada' },
  { key: 'categoria', name: 'Categoria' },
  { key: 'inscripcion', name: 'Costo inscripción' },
  { key: 'coaching', name: 'Costo coaching' },
  { key: 'tunel', name: 'Aportación' },
  { key: 'botiquin', name: 'Costo botiquín' }
]

export default function CostosJugadorPage() {
  const { modalType, currentItem } = useModal()

  const { costos, loading, getDataCostoJugador, handleSubmit, handleDelete } =
    useCostosJugadores()

  useEffect(() => {
    const getCostosJugador = async () => {
      return await getDataCostoJugador()
    }

    getCostosJugador()
  }, [getDataCostoJugador])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={costos}
        title='Costos de jugador por temporada'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm
          handleSubmit={handleSubmit}
          Inputs={<FormCostosJugadores />}
        />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
