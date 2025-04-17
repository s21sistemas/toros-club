import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useModule } from '../hooks/useModule'
import { FormModules } from '../components/modals/FormModules'

const columns = [{ key: 'label', name: 'Nombre' }]

export default function ModulosPage() {
  const { modalType, currentItem } = useModal()

  const { modules, loading, getDataModules, handleSubmit, handleDelete } =
    useModule()

  useEffect(() => {
    const getUser = async () => {
      return await getDataModules()
    }

    getUser()
  }, [getDataModules])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={modules}
        title='Módulos'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormModules />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
