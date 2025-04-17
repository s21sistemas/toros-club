import { useEffect } from 'react'
import { BaseForm } from '../components/BaseForm'
import { BaseTable } from '../components/BaseTable'
import { ModalDelete } from '../components/ModalDelete'
import { useModal } from '../hooks/useModal'
import { useBank } from '../hooks/useBank'
import { FormBanks } from '../components/modals/FormBanks'
import { ReporteBancos } from '../components/ReporteBancos'

const columns = [
  { key: 'nombre', name: 'Nombre' },
  { key: 'no_cuenta', name: 'No. Cuenta' },
  { key: 'clabe', name: 'CLABE' }
]

export default function BancosPage() {
  const { modalType, currentItem } = useModal()

  const { banks, loading, getDataBanks, handleSubmit, handleDelete } = useBank()

  useEffect(() => {
    const getBanks = async () => {
      return await getDataBanks()
    }

    getBanks()
  }, [getDataBanks])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable
        columns={columns}
        data={banks}
        title='Bancos'
        loading={loading}
      />

      {(modalType === 'add' ||
        modalType === 'edit' ||
        modalType === 'view') && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormBanks />} />
      )}

      {modalType === 'delete' && currentItem && (
        <ModalDelete handleDelete={handleDelete} />
      )}

      <ReporteBancos />
    </div>
  )
}
