import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useTallas } from '../hooks/useTallas'
import { FormTallas } from '../components/modals/FormTallas'

const columns = [
  { key: 'nombre', name: 'Jugador' },
  { key: 'tipo_categoria', name: 'Tipo categoria' },
  { key: 'peso', name: 'Peso' },
  { key: 'tallas', name: 'Tallas' }
]

export default function TallasPage() {
  const { modalType, currentItem } = useModal()

  const { tallas, loading, getDataTalla, handleSubmit, handleDelete } =
    useTallas()

  useEffect(() => {
    const getBanks = async () => {
      return await getDataTalla()
    }

    getBanks()
  }, [getDataTalla])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={tallas}
        title='Tallas'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormTallas />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
