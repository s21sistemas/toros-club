import { useModal } from '../../hooks/useModal'
import { usePaymentPlayer } from '../../hooks/usePaymentPlayer'
import { InputField } from '../InputField'
import { AlertaCard } from '../AlertaCard'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'
import { formOptions } from '../../utils/formPaymentsPlayersOptions'
import { CardAbonos } from '../CardAbonos'

export const FormPaymentsPlayers = ({ user, handleCleanPay }) => {
  const {
    view,
    document,
    formData,
    handleNestedInputChange,
    handleInputChange,
    handleCheckboxChange,
    categoriaOptions
  } = useModal()

  const { loadOptions, loadOptionsTemporadas } = usePaymentPlayer()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 md:grid-cols-2 mb-7'>
        <AlertaCard text='Jugador' />
        <InputField
          type='async'
          label='Selecciona el jugador *'
          name='jugador'
          required={true}
          value={formData.jugador || ''}
          onChange={handleInputChange}
          disabled={document ? true : view}
          loadOptions={loadOptions}
          classInput='md:col-span-2'
        />

        <InputField
          type='async'
          label='Selecciona la temporada *'
          name='temporadaId'
          required={true}
          value={formData.temporadaId}
          onChange={handleInputChange}
          disabled={view}
          loadOptions={loadOptionsTemporadas}
          classInput='md:col-span-2'
        />

        <InputField
          type='select'
          label='Categoría *'
          name='categoria'
          required={true}
          value={formData.categoria}
          opcSelect={categoriaOptions}
          onChange={handleInputChange}
          disabled={view}
          classInput='md:col-span-2'
        />

        <AlertaCard text='Pago de inscripción' />
        <div className='sm:col-span-6 md:col-span-2'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              name='cambiar_inscripcion'
              checked={formData.cambiar_inscripcion || false}
              onChange={handleCheckboxChange}
              className='sr-only peer outline-0'
              disabled={user?.coordinadora_jugadores}
            />
            <div className="relative w-9 h-5 bg-gray-500 cursor-pointer peer-disabled:bg-gray-300 peer-disabled:cursor-auto peer-focus:outline-0 outline-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            <span className='ms-3 text-sm font-medium text-gray-900'>
              ¿Cambiar monto de inscripción?
            </span>
          </label>
        </div>

        {formOptions.inscriptionFields.map(
          ({ type, label, name, required, opcSelect, condition, value }) =>
            (!condition || condition(formData.pagos?.[0] || {})) && (
              <InputField
                key={name}
                type={type}
                label={label}
                required={
                  formData.pagos?.[0]?.estatus === 'pagado' ? true : required
                }
                opcSelect={opcSelect}
                name={`pagos.0.${name}`}
                value={value ? value : formData.pagos?.[0]?.[name] ?? ''}
                onChange={handleNestedInputChange}
                disabled={
                  ['total_abonado', 'monto', 'total_restante'].includes(name) ||
                  (formData.pagos?.[0]?.total_abonado >=
                    formData.pagos?.[0]?.monto &&
                    name === 'abono') ||
                  (formData.pagos?.[0]?.estatus === 'pagado' &&
                    name !== 'estatus' &&
                    name !== 'fecha_pago' &&
                    name !== 'metodo_pago') ||
                  user?.coordinadora_jugadores ||
                  (name === 'submonto' && !formData.cambiar_inscripcion)
                    ? true
                    : view
                }
              />
            )
        )}

        {formData.pagos?.[0]?.abono === 'SI' && (
          <>
            <InputField
              type='number'
              label='Cantidad abonada *'
              required={true}
              name='cantidad_abono_ins'
              value={formData.cantidad_abono_ins ?? ''}
              onChange={handleInputChange}
              disabled={formData.pagos?.[0]?.estatus === 'pagado' ? true : view}
            />

            <InputField
              type='date'
              label='Fecha del abono *'
              required={true}
              name='fecha_abono_ins'
              value={formData.fecha_abono_ins ?? ''}
              onChange={handleInputChange}
              disabled={formData.pagos?.[0]?.estatus === 'pagado' ? true : view}
            />

            <InputField
              type='select'
              label='Método de pago *'
              required={true}
              name='metodo_pago_abono_ins'
              value={formData.metodo_pago_abono_ins ?? ''}
              opcSelect={[
                { value: '', label: 'Selecciona una opción' },
                {
                  value: 'transferencia bancaria',
                  label: 'Transferencia bancaria'
                },
                { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'cheques', label: ' Cheques' }
              ]}
              onChange={handleInputChange}
              disabled={formData.pagos?.[0]?.estatus === 'pagado' ? true : view}
            />
          </>
        )}

        {formData.pagos?.[0]?.abonos?.length > 0 && (
          <>
            <AlertaCard text='Abonos de inscripción' />

            {formData.pagos[0].abonos.map((abono) => (
              <div
                className='sm:grid-cols-1 md:col-span-2'
                key={crypto.randomUUID()}
              >
                <CardAbonos
                  amount={abono.cantidad}
                  date={abono.fecha}
                  method={abono.metodo}
                />
                <hr className='sm:grid-cols-3 gap-2 md:col-span-2' />
              </div>
            ))}
          </>
        )}

        <AlertaCard text='Pago de coaching' />
        {formOptions.coachingFields.map(
          ({ type, label, name, required, opcSelect }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              required={
                formData.pagos?.[1]?.estatus === 'pagado' ? true : required
              }
              opcSelect={opcSelect}
              name={`pagos.1.${name}`}
              value={formData.pagos?.[1]?.[name] ?? ''}
              onChange={handleNestedInputChange}
              disabled={
                ['total_abonado', 'monto', 'total_restante'].includes(name) ||
                (formData.pagos?.[1]?.total_abonado >=
                  formData.pagos?.[1]?.monto &&
                  name === 'abono') ||
                (formData.pagos?.[1]?.estatus === 'pagado' &&
                  name !== 'estatus' &&
                  name !== 'fecha_pago' &&
                  name !== 'metodo_pago')
                  ? true
                  : view
              }
            />
          )
        )}

        {formData.pagos?.[1]?.abono === 'SI' && (
          <>
            <InputField
              type='number'
              label='Cantidad abonada *'
              required={true}
              name='cantidad_abono_coach'
              value={formData.cantidad_abono_coach ?? ''}
              onChange={handleInputChange}
              disabled={formData.pagos?.[1]?.estatus === 'pagado' ? true : view}
            />

            <InputField
              type='date'
              label='Fecha del abono *'
              required={true}
              name='fecha_abono_coach'
              value={formData.fecha_abono_coach ?? ''}
              onChange={handleInputChange}
              disabled={formData.pagos?.[1]?.estatus === 'pagado' ? true : view}
            />

            <InputField
              type='select'
              label='Método de pago *'
              required={true}
              name='metodo_pago_abono_coach'
              value={formData.metodo_pago_abono_coach ?? ''}
              opcSelect={[
                { value: '', label: 'Selecciona una opción' },
                {
                  value: 'transferencia bancaria',
                  label: 'Transferencia bancaria'
                },
                { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'cheques', label: ' Cheques' }
              ]}
              onChange={handleInputChange}
              disabled={formData.pagos?.[1]?.estatus === 'pagado' ? true : view}
            />
          </>
        )}

        {formData.pagos?.[1]?.abonos?.length > 0 && (
          <>
            <AlertaCard text='Abonos de coaching' />

            <button
              type='button'
              onClick={() => handleCleanPay(formData.id)}
              className='rounded-md border border-transparent shadow-lg px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 col-start-1 col-end-3 sm:text-sm cursor-pointer transition-all'
            >
              Limpiar abonos
            </button>

            {formData.pagos[1].abonos.map((abono) => (
              <div
                className='sm:grid-cols-1 md:col-span-2'
                key={crypto.randomUUID()}
              >
                <CardAbonos
                  amount={abono.cantidad}
                  date={abono.fecha}
                  method={abono.metodo}
                />
                <hr className='sm:grid-cols-3 gap-2 md:col-span-2' />
              </div>
            ))}
          </>
        )}

        <AlertaCard text='Pago de aportación' />
        {formOptions.tunelFields.map(
          ({ type, label, name, required, opcSelect }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              required={
                formData.pagos?.[2]?.estatus === 'pagado' ? true : required
              }
              opcSelect={opcSelect}
              name={`pagos.2.${name}`}
              value={formData.pagos?.[2]?.[name] ?? ''}
              onChange={handleNestedInputChange}
              disabled={
                ['total_abonado', 'monto', 'total_restante'].includes(name) ||
                (formData.pagos?.[2]?.total_abonado >=
                  formData.pagos?.[2]?.monto &&
                  name === 'abono') ||
                (formData.pagos?.[2]?.estatus === 'pagado' &&
                  name !== 'estatus' &&
                  name !== 'fecha_pago' &&
                  name !== 'metodo_pago')
                  ? true
                  : view
              }
            />
          )
        )}

        {formData.pagos?.[2]?.abono === 'SI' && (
          <>
            <InputField
              type='number'
              label='Cantidad abonada *'
              required={true}
              name='cantidad_abono_tunel'
              value={formData.cantidad_abono_tunel ?? ''}
              onChange={handleInputChange}
              disabled={formData.pagos?.[2]?.estatus === 'pagado' ? true : view}
            />

            <InputField
              type='date'
              label='Fecha del abono *'
              required={true}
              name='fecha_abono_tunel'
              value={formData.fecha_abono_tunel ?? ''}
              onChange={handleInputChange}
              disabled={formData.pagos?.[2]?.estatus === 'pagado' ? true : view}
            />

            <InputField
              type='select'
              label='Método de pago *'
              required={true}
              name='metodo_pago_abono_tunel'
              value={formData.metodo_pago_abono_tunel ?? ''}
              opcSelect={[
                { value: '', label: 'Selecciona una opción' },
                {
                  value: 'transferencia bancaria',
                  label: 'Transferencia bancaria'
                },
                { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'cheques', label: ' Cheques' }
              ]}
              onChange={handleInputChange}
              disabled={formData.pagos?.[2]?.estatus === 'pagado' ? true : view}
            />
          </>
        )}

        {formData.pagos?.[2]?.abonos?.length > 0 && (
          <>
            <AlertaCard text='Abonos de aportación' />

            {formData.pagos[2].abonos.map((abono) => (
              <div
                className='sm:grid-cols-1 md:col-span-2'
                key={crypto.randomUUID()}
              >
                <CardAbonos
                  amount={abono.cantidad}
                  date={abono.fecha}
                  method={abono.metodo}
                />
                <hr className='sm:grid-cols-3 gap-2 md:col-span-2' />
              </div>
            ))}
          </>
        )}

        <AlertaCard text='Pago de botiquín' />
        {formOptions.botiquinFields.map(
          ({ type, label, name, required, opcSelect }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              required={
                formData.pagos?.[3]?.estatus === 'pagado' ? true : required
              }
              opcSelect={opcSelect}
              name={`pagos.3.${name}`}
              value={formData.pagos?.[3]?.[name] ?? ''}
              onChange={handleNestedInputChange}
              disabled={
                ['total_abonado', 'monto', 'total_restante'].includes(name) ||
                (formData.pagos?.[3]?.total_abonado >=
                  formData.pagos?.[3]?.monto &&
                  name === 'abono') ||
                (formData.pagos?.[3]?.estatus === 'pagado' &&
                  name !== 'estatus' &&
                  name !== 'fecha_pago' &&
                  name !== 'metodo_pago')
                  ? true
                  : view
              }
            />
          )
        )}

        {formData.pagos?.[3]?.abono === 'SI' && (
          <>
            <InputField
              type='number'
              label='Cantidad abonada *'
              required={true}
              name='cantidad_abono_botiquin'
              value={formData.cantidad_abono_botiquin ?? ''}
              onChange={handleInputChange}
              disabled={formData.pagos?.[3]?.estatus === 'pagado' ? true : view}
            />

            <InputField
              type='date'
              label='Fecha del abono *'
              required={true}
              name='fecha_abono_botiquin'
              value={formData.fecha_abono_botiquin ?? ''}
              onChange={handleInputChange}
              disabled={formData.pagos?.[3]?.estatus === 'pagado' ? true : view}
            />

            <InputField
              type='select'
              label='Método de pago *'
              required={true}
              name='metodo_pago_abono_botiquin'
              value={formData.metodo_pago_abono_botiquin ?? ''}
              opcSelect={[
                { value: '', label: 'Selecciona una opción' },
                {
                  value: 'transferencia bancaria',
                  label: 'Transferencia bancaria'
                },
                { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'cheques', label: ' Cheques' }
              ]}
              onChange={handleInputChange}
              disabled={formData.pagos?.[3]?.estatus === 'pagado' ? true : view}
            />
          </>
        )}

        {formData.pagos?.[3]?.abonos?.length > 0 && (
          <>
            <AlertaCard text='Abonos de botiquín' />

            {formData.pagos[3].abonos.map((abono) => (
              <div
                className='sm:grid-cols-1 md:col-span-2'
                key={crypto.randomUUID()}
              >
                <CardAbonos
                  amount={abono.cantidad}
                  date={abono.fecha}
                  method={abono.metodo}
                />
                <hr className='sm:grid-cols-3 gap-2 md:col-span-2' />
              </div>
            ))}
          </>
        )}

        {/* Totales */}
        <AlertaCard text='Total de pagos' />
        {formOptions.paymentsFields.map(
          ({ type, label, name, required, opcSelect }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              required={required}
              opcSelect={opcSelect}
              name={name}
              value={formData[name] ?? ''}
              onChange={handleNestedInputChange}
              disabled={
                [
                  'monto_total',
                  'monto_total_pagado',
                  'monto_total_pendiente'
                ].includes(name)
                  ? true
                  : view
              }
            />
          )
        )}
      </div>
      <hr className='text-gray-300' />
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
