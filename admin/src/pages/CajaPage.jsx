import { useEffect } from 'react'
import { BaseTable } from '../components/BaseTable'
import { useModal } from '../hooks/useModal'
import { useCaja } from '../hooks/useCaja'
import { FormCaja } from '../components/modals/FormCaja'
import { BaseForm } from '../components/BaseForm'

const columns = [
  { key: 'usuario', name: 'Coordinadora' },
  { key: 'nombre_seccion', name: 'Jugador/Porrista' },
  { key: 'concepto', name: 'Concepto' },
  { key: 'metodo_pago', name: 'Método' },
  { key: 'fecha', name: 'Fecha recibido' },
  { key: 'total', name: 'Monto' }
]

export default function CajaPage() {
  const { modalType } = useModal()

  const { caja, loading, getDataCajas, handleSubmit } = useCaja()

  useEffect(() => {
    const getCaja = async () => {
      return await getDataCajas()
    }

    getCaja()
  }, [getDataCajas])

  return (
    <div className='md:p-4 bg-gray-100'>
      <BaseTable columns={columns} data={caja} title='Caja' loading={loading} />

      {modalType === 'edit' && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormCaja />} />
      )}
    </div>
  )
}
