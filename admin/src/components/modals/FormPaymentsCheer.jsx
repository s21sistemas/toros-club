import { useModal } from '../../hooks/useModal'
import { InputField } from '../InputField'
import { AlertaCard } from '../AlertaCard'
import { ButtonsModal } from './ButtonsModal'
import { CancelButtonModal } from './CancelButtonModal'
import { usePaymentCheer } from '../../hooks/usePaymentCheer'
import { formOptions } from '../../utils/formPaymentsCheer'
import { CardAbonos } from '../CardAbonos'
import { formatearMonedaMXN } from '../../utils/formattedCurrancy'
import { CardHistorialPagosCoaching } from '../CardHistorialPagosCoaching'

export const FormPaymentsCheer = ({ user }) => {
  const {
    view,
    document,
    formData,
    handleNestedInputChange,
    handleInputChange,
    handleCheckboxChange
  } = useModal()

  const { loadOptions, loadOptionsTemporadas } = usePaymentCheer()

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 md:grid-cols-2 mb-7'>
        <AlertaCard text='Jugador' />
        <InputField
          type='async'
          label='Selecciona la porrista'
          name='porrista'
          required={true}
          value={formData.porrista || ''}
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
          ({ type, label, name, required, opcSelect }) => (
            <InputField
              key={name}
              type={type}
              label={label}
              required={
                formData.pagos?.[0]?.estatus === 'pagado' ? true : required
              }
              opcSelect={opcSelect}
              name={`pagos.0.${name}`}
              value={formData.pagos?.[0]?.[name] ?? ''}
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
                user?.coordinadora_porristas ||
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

        <AlertaCard text='Pago de Coaching' />
        <div className='sm:col-span-6 md:col-span-2'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              name='pagos.1.cancelar_coach'
              checked={formData.pagos?.[1]?.cancelar_coach || false}
              onChange={handleCheckboxChange}
              className='sr-only peer outline-0'
              disabled={
                user?.coordinadora_jugadores ||
                formData.pagos?.[1]?.estatus === 'pagado'
              }
            />
            <div className="relative w-9 h-5 bg-gray-500 cursor-pointer peer-disabled:bg-gray-300 peer-disabled:cursor-auto peer-focus:outline-0 outline-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            <span className='ms-3 text-sm font-medium text-gray-900'>
              Cancelar pago de coaching
            </span>
          </label>
        </div>
        <div className='sm:col-span-6 md:col-span-2'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              name='cambiar_coach'
              checked={formData.cambiar_coach || false}
              onChange={handleCheckboxChange}
              className='sr-only peer outline-0'
              disabled={user?.coordinadora_jugadores}
            />
            <div className="relative w-9 h-5 bg-gray-500 cursor-pointer peer-disabled:bg-gray-300 peer-disabled:cursor-auto peer-focus:outline-0 outline-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            <span className='ms-3 text-sm font-medium text-gray-900'>
              ¿Cambiar monto de coaching?
            </span>
          </label>
        </div>

        <div className='sm:grid-cols-3 gap-2 md:col-span-2'>
          <div className='border border-gray-200 shadow-lg p-4 text-center md:w-[40%] mx-auto'>
            <p>
              <b>Fecha de inscripción:</b> <u>{formData.fecha_inscripcion}</u>
            </p>
          </div>
        </div>

        {formOptions.coachingFields.map(
          ({ type, label, name, required, opcSelect, condition }) =>
            (!condition || condition(formData.pagos?.[1] || {})) && (
              <InputField
                key={name}
                type={type}
                label={label}
                required={
                  formData.pagos?.[1]?.estatus === 'pagado' ? true : required
                }
                opcSelect={opcSelect}
                name={`pagos.1.${name}`}
                value={
                  name === 'fecha_inicial'
                    ? formData.pagos?.[1]?.fecha_inicial
                      ? formData.pagos?.[1]?.fecha_inicial
                      : formData.pagos?.[1]?.fecha_pago ||
                        formData.fecha_inicial
                    : formData.pagos?.[1]?.[name] ?? ''
                }
                onChange={handleNestedInputChange}
                disabled={
                  ['total_abonado', 'monto', 'total_restante'].includes(name) ||
                  (formData.pagos?.[1]?.total_abonado >=
                    formData.pagos?.[1]?.monto &&
                    name === 'abono') ||
                  (formData.pagos?.[1]?.estatus === 'pagado' &&
                    name !== 'estatus' &&
                    name !== 'fecha_pago' &&
                    name !== 'metodo_pago') ||
                  (name === 'submonto' && !formData.cambiar_coach) ||
                  formData.pagos?.[1]?.cancelar_coach
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

            <div className='sm:grid-cols-3 gap-2 md:col-span-2'>
              <div className='border border-gray-200 shadow-lg p-4 text-center md:w-[40%] mx-auto'>
                <p className='font-semibold'>
                  Total de abonos:{' '}
                  <span className='text-green-600'>
                    {formatearMonedaMXN(
                      formData.pagos?.[1]?.historial_total_abonado || 0
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className='sm:grid-cols-1 md:col-span-2 h-50 overflow-y-auto'>
              {formData.pagos[1].abonos.map((abono) => (
                <div key={crypto.randomUUID()}>
                  <CardAbonos
                    amount={abono.cantidad}
                    date={abono.fecha}
                    method={abono.metodo}
                  />
                  <hr className='sm:grid-cols-3 gap-2 md:col-span-2' />
                </div>
              ))}
            </div>
          </>
        )}

        {formData.pagos?.[1]?.pago_coaching?.length > 0 && (
          <>
            <AlertaCard text='Historial de pagos completos de coaching' />

            <div className='sm:grid-cols-3 gap-2 md:col-span-2'>
              <div className='border border-gray-200 shadow-lg p-4 text-center md:w-[40%] mx-auto'>
                <p className='font-semibold'>
                  Total de pagado:{' '}
                  <span className='text-green-600'>
                    {formatearMonedaMXN(
                      formData.pagos?.[1]?.pago_coaching.reduce(
                        (acum, pago) =>
                          acum + (parseFloat(pago.total_pagado) || 0),
                        0
                      ) || 0
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className='sm:grid-cols-1 md:col-span-2 h-50 overflow-y-auto'>
              {formData.pagos[1].pago_coaching.map((pago) => (
                <div key={crypto.randomUUID()}>
                  <CardHistorialPagosCoaching pago={pago} />
                  <hr className='sm:grid-cols-3 gap-2 md:col-span-2' />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Totales */}
        <AlertaCard text='Total de inscripción' />
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
              disabled={true}
            />
          )
        )}

        <AlertaCard text='Total de pagos del coaching' />
        {formOptions.paymentsCoachingField.map(
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
              disabled={true}
            />
          )
        )}

        <AlertaCard text='Totales' />
        {formOptions.paymentsCompletosFields.map(
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
              disabled={true}
            />
          )
        )}
      </div>
      <hr className='text-gray-300' />
      {view ? <CancelButtonModal /> : <ButtonsModal />}
    </>
  )
}
