import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { usePeticionEliminacion } from '../hooks/usePeticionEliminacion'
import { FormPeticionEliminacion } from '../components/modals/FormPeticionEliminacion'

const columns = [
  { key: 'email', name: 'Correo' },
  { key: 'reason', name: 'Razón' },
  { key: 'status', name: 'Estatus' }
]

export default function PeticionesEliminacionPage() {
  const { modalType, currentItem } = useModal()

  const {
    peticionEliminacion,
    loading,
    getDataPeticionEliminacion,
    handleSubmit,
    handleDelete
  } = usePeticionEliminacion()

  useEffect(() => {
    const getBanks = async () => {
      return await getDataPeticionEliminacion()
    }

    getBanks()
  }, [getDataPeticionEliminacion])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={peticionEliminacion}
        title='Peticiones de eliminación de cuentas'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm
          handleSubmit={handleSubmit}
          Inputs={<FormPeticionEliminacion />}
        />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
