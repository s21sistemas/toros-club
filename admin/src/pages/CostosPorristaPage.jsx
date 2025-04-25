import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useCostosPorristas } from '../hooks/useCostosPorristas'
import { FormCostosPorristas } from '../components/modals/FormCostosPorristas'

const columns = [
  { key: 'temporada', name: 'Temporada' },
  { key: 'inscripcion', name: 'Costo de inscripción' },
  { key: 'coaching', name: 'Costo de coaching' }
]

export default function CostosPorristaPage() {
  const { modalType, currentItem } = useModal()

  const { costos, loading, getDataCostoPorrista, handleSubmit, handleDelete } =
    useCostosPorristas()

  useEffect(() => {
    const getCostosPorristas = async () => {
      return await getDataCostoPorrista()
    }

    getCostosPorristas()
  }, [getDataCostoPorrista])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={costos}
        title='Costos de porristas por temporada'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm
          handleSubmit={handleSubmit}
          Inputs={<FormCostosPorristas />}
        />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
