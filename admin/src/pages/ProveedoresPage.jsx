import { useProveedor } from '../hooks/useProveedor'
import { useEffect } from 'react'
import { useModal } from '../hooks/useModal'
import { FormProveedores } from '../components/modals/FormProveedores'
import { BaseTable } from '../components/BaseTable'
import { BaseForm } from '../components/BaseForm'
import { ModalDelete } from '../components/ModalDelete'

const columns = [
  { key: 'nombre', name: 'Proveedor' },
  { key: 'nombre_comercial', name: 'Nombre comercial' },
  { key: 'rfc', name: 'RFC' }
]

export default function ProveedoresPage() {
  const { modalType, currentItem } = useModal()

  const { proveedores, loading, getDataProveedor, handleSubmit, handleDelete } =
    useProveedor()

  useEffect(() => {
    const getProveedores = async () => {
      return await getDataProveedor()
    }

    getProveedores()
  }, [getDataProveedor])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={proveedores}
        title='Proveedores'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormProveedores />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
