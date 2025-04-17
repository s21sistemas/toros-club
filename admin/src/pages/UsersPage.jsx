import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useUser } from '../hooks/useUser'
import { FormUsers } from '../components/modals/FormUsers'

const columns = [
  { key: 'nombre_completo', name: 'Nombre' },
  { key: 'celular', name: 'Celular' },
  { key: 'ocupacion', name: 'Ocupación' },
  { key: 'correo', name: 'Correo' },
  { key: 'codigo_acceso', name: 'Código' },
  { key: 'rol', name: 'Rol' }
]

export default function UsersPage() {
  const { modalType, currentItem } = useModal()

  const { users, loading, getDataUsers, handleSubmit, handleDelete } = useUser()

  useEffect(() => {
    const getUser = async () => {
      return await getDataUsers()
    }

    getUser()
  }, [getDataUsers])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={users}
        title='Usuarios'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormUsers />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
