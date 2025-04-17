import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useTemporadas } from '../hooks/useTemporadas'
import { FormTemporadas } from '../components/modals/FormTemporadas'

const columnsTemp = [
  { key: 'temporada', name: 'Temporada' },
  { key: 'estado_temporada', name: 'Estado' },
  { key: 'date_inicio', name: 'Fecha de inicio' },
  { key: 'date_fin', name: 'Fecha de fin' }
]

export default function TemporadasCategoriasPage() {
  const { modalType, currentItem } = useModal()

  const { temporadas, loading, getDataTemporadas, handleSubmit, handleDelete } =
    useTemporadas()

  useEffect(() => {
    const getTemporadas = async () => {
      return await getDataTemporadas()
    }

    getTemporadas()
  }, [getDataTemporadas])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columnsTemp}
        data={temporadas}
        title='Gestión de temporadas'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormTemporadas />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
