import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useCategorias } from '../hooks/useCategorias'
import { FormCategorias } from '../components/modals/FormCategorias'
import { ReporteCategorias } from '../components/ReporteCategorias'

const columnsTemp = [
  { key: 'temporada', name: 'Temporada' },
  { key: 'nombre_categoria', name: 'Categoría' },
  { key: 'date_inicio', name: 'Fecha de nacimiento mínima' },
  { key: 'date_fin', name: 'Fecha de nacimiento máxima' },
  { key: 'sexo', name: 'Sexo' }
]

export default function TemporadasCategoriasPage() {
  const { modalType, currentItem } = useModal()

  const { categorias, loading, getDataCategorias, handleSubmit, handleDelete } =
    useCategorias()

  useEffect(() => {
    const getCategorias = async () => {
      return await getDataCategorias()
    }

    getCategorias()
  }, [getDataCategorias])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columnsTemp}
        data={categorias}
        title='Categorias'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormCategorias />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}

      <ReporteCategorias />
    </div>
  )
}
