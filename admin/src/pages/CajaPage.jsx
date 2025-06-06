import { useEffect } from 'react'
import { BaseTable } from '../components/BaseTable'
import { useModal } from '../hooks/useModal'
import { useCaja } from '../hooks/useCaja'
import { FormCaja } from '../components/modals/FormCaja'
import { BaseForm } from '../components/BaseForm'
import { FiltroCoordinadoraCaja } from '../components/FiltroCoordinadoraCaja'

const columns = [
  { key: 'usuario', name: 'Coordinadora' },
  { key: 'nombre_seccion', name: 'Jugador/Porrista' },
  { key: 'concepto', name: 'Concepto' },
  { key: 'metodo_pago', name: 'Método' },
  { key: 'fecha', name: 'Fecha recibido' },
  { key: 'total', name: 'Monto' }
]

export default function CajaPage() {
  const { modalType, formData, handleInputChange, view } = useModal()

  const {
    caja,
    loading,
    getDataCajas,
    handleSubmit,
    handleFiltrar,
    handleClearFilter,
    loadOptionsCoordinadora
  } = useCaja(handleInputChange)

  useEffect(() => {
    const getCaja = async () => {
      return await getDataCajas()
    }

    getCaja()
  }, [getDataCajas])

  return (
    <div className='md:p-4 bg-gray-100'>
      <FiltroCoordinadoraCaja
        formData={formData}
        handleInputChange={handleInputChange}
        view={view}
        loadOptionsCoordinadora={loadOptionsCoordinadora}
        handleFiltrar={handleFiltrar}
        handleClearFilter={handleClearFilter}
      />

      <BaseTable columns={columns} data={caja} title='Caja' loading={loading} />

      {modalType === 'edit' && (
        <BaseForm handleSubmit={handleSubmit} Inputs={<FormCaja />} />
      )}
    </div>
  )
}
