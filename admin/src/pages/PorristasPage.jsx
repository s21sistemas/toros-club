import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useCheerleader } from '../hooks/useCheerleader'
import { FormCheerleaders } from '../components/modals/FormCheerleaders'

const columns = [
  { key: 'nombre', name: 'Nombre' },
  { key: 'apellido_p', name: 'Apellido paterno' },
  { key: 'apellido_m', name: 'Apellido materno' },
  { key: 'curp', name: 'CURP' }
]

export default function PorristasPage() {
  const { modalType, currentItem } = useModal()

  const {
    cheerleader,
    loading,
    getDataCheerleaders,
    handleSubmit,
    handleDelete
  } = useCheerleader()

  useEffect(() => {
    const getUser = async () => {
      return await getDataCheerleaders()
    }

    getUser()
  }, [getDataCheerleaders])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={cheerleader}
        title='Porristas'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormCheerleaders />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
