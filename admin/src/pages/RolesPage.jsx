import { useEffect } from 'react'
import { useModal } from '../hooks/useModal'
import { BaseTable } from '../components/BaseTable'
import { BaseForm } from '../components/BaseForm'
import { ModalDelete } from '../components/ModalDelete'
import { useRole } from '../hooks/useRole'
import { FormRoles } from '../components/modals/FormRoles'

const columns = [
  { key: 'nombre', name: 'Nombre' },
  { key: 'permisos_view', name: 'Permisos' },
  { key: 'accesos_view', name: 'Módulos' }
]

const RolesPage = () => {
  const { modalType, currentItem } = useModal()

  const { roles, loading, getDataRoles, handleSubmit, handleDelete } = useRole()

  useEffect(() => {
    const getUser = async () => {
      return await getDataRoles()
    }

    getUser()
  }, [getDataRoles])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={roles}
        title='Roles'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormRoles />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
export default RolesPage
