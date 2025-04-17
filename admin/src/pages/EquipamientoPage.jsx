import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useEquipamiento } from '../hooks/useEquipamiento'
import { FormEquipamiento } from '../components/modals/FormEquipamiento'

const columns = [
  { key: 'jugador', name: 'Jugador' },
  { key: 'equipo_prestado', name: 'Equipo prestado' },
  { key: 'devuelto', name: '¿Ya fue devuelto?' }
]

export default function EquipamientoPage() {
  const { modalType, currentItem } = useModal()

  const {
    equipamiento,
    loading,
    getDataEquipamiento,
    handleSubmit,
    handleDelete
  } = useEquipamiento()

  useEffect(() => {
    const getEquipamiento = async () => {
      return await getDataEquipamiento()
    }

    getEquipamiento()
  }, [getDataEquipamiento])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={equipamiento}
        title='Asignación de equipamiento'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormEquipamiento />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
