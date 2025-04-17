import { useEffect } from 'react'
import { useModal } from '../hooks/useModal'
import { BaseTable } from '../components/BaseTable'
import { BaseForm } from '../components/BaseForm'
import { ModalDelete } from '../components/ModalDelete'
import { useArticulo } from '../hooks/useArticulo'
import { FormArticulos } from '../components/modals/FormArticulos'

const columns = [
  { key: 'nombre', name: 'Nombre del artículo' },
  { key: 'precio_compra', name: 'Precio de compra' },
  { key: 'precio_venta', name: 'Precio de venta' },
  { key: 'precio_reposicion', name: 'Precio de reposición' },
  { key: 'articulo_equipar', name: '¿El artículo es para equipar?' }
]

export default function ArticulosPage() {
  const { modalType, currentItem } = useModal()

  const { articulos, loading, getDataArticulo, handleSubmit, handleDelete } =
    useArticulo()

  useEffect(() => {
    const getArticulos = async () => {
      return await getDataArticulo()
    }

    getArticulos()
  }, [getDataArticulo])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={articulos}
        title='Artículos'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormArticulos />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
