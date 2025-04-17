import { useEffect } from 'react'
import { BaseTable } from '../components/BaseTable'
import { useAlerta } from '../hooks/useAlerta'
import { useModal } from '../hooks/useModal'
import { FormCorreo } from '../components/modals/FormCorreo'
import { BaseForm } from '../components/BaseForm'
import { ModalDelete } from '../components/ModalDelete'

const columns = [
  { key: 'tutor', name: 'Tutor' },
  { key: 'asunto', name: 'Asunto' },
  { key: 'estatus', name: '¿Correo visto?' },
  { key: 'fecha', name: 'Fecha del envío' }
]

export default function AlertaPage() {
  const { modalType, currentItem } = useModal()
  const { alertas, loading, getDataAlerta, handleDelete } = useAlerta()

  useEffect(() => {
    const getAlerta = async () => {
      return await getDataAlerta()
    }

    getAlerta()
  }, [getDataAlerta])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={alertas}
        title='Correos enviados'
        loading={loading}
      />

      {modalType === 'view' && <BaseForm Inputs={<FormCorreo />} />}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}
    </div>
  )
}
