import { useEffect, useState } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useCheerleader } from '../hooks/useCheerleader'
import { FormCheerleaders } from '../components/modals/FormCheerleaders'
import { useAuth } from '../hooks/useAuth'

const columns = [
  { key: 'nombre', name: 'Nombre' },
  { key: 'apellido_p', name: 'Apellido paterno' },
  { key: 'apellido_m', name: 'Apellido materno' },
  { key: 'curp', name: 'CURP' }
]

export default function PorristasPage() {
  const { user } = useAuth()

  const { modalType, currentItem } = useModal()

  const {
    cheerleader,
    loading,
    getDataCheerleaders,
    handleSubmit,
    handleDelete
  } = useCheerleader()

  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    const getUser = async () => {
      return await getDataCheerleaders()
    }

    getUser()
  }, [getDataCheerleaders])

  useEffect(() => {
    if (user?.coordinadora_porristas) {
      const porristas = user.porristaId.map((p) => p.value)

      const cheerFilter = cheerleader.filter((data) =>
        porristas.includes(data.id)
      )

      setFilterData(cheerFilter)
    } else {
      setFilterData(cheerleader)
    }
  }, [cheerleader])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={filterData}
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
