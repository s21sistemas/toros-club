import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'sonner'
import { InputField } from './InputField'
import { AlertaCard } from './AlertaCard'

export const CalculadoraCoaching = () => {
  const [form, setForm] = useState({
    fecha_inicial: '',
    fecha_final: '',
    submonto: 150,
    monto: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validaciones de requeridos
    if (!form.fecha_inicial || !form.fecha_final || !form.submonto) {
      toast.warning('Todos los campos son obligatorios')
      return
    }

    // Validación de fechas
    const inicio = dayjs(form.fecha_inicial)
    const fin = dayjs(form.fecha_final)

    if (!inicio.isValid() || !fin.isValid()) {
      toast.warning('Las fechas no son válidas')
      return
    }

    if (fin.isBefore(inicio)) {
      toast.warning('La fecha final no puede ser menor a la fecha inicial')
      return
    }

    // Calcular semanas (mínimo 1)
    let semanas = fin.diff(inicio, 'week')
    if (semanas === 0) semanas = 1

    const submonto = parseFloat(form.submonto)
    if (isNaN(submonto) || submonto <= 0) {
      toast.warning('El submonto debe ser un número mayor a 0')
      return
    }

    const monto = semanas * submonto

    setForm((prev) => ({
      ...prev,
      monto: monto.toFixed(2)
    }))
  }

  return (
    <form className='p-4 bg-white rounded-lg mt-6 ' onSubmit={handleSubmit}>
      <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
        <div className='md:col-span-6 sm:col-span-6'>
          <AlertaCard text='Calcula el monto de coaching por semanas.' />
        </div>

        <InputField
          type='date'
          label='Fecha inicial'
          name='fecha_inicial'
          required={true}
          value={form.fecha_inicial}
          onChange={handleInputChange}
          classInput='md:col-span-3'
        />

        <InputField
          type='date'
          label='Fecha final'
          name='fecha_final'
          required={true}
          value={form.fecha_final}
          onChange={handleInputChange}
          classInput='md:col-span-3'
        />

        <InputField
          type='number'
          label='Submonto (por semana)'
          name='submonto'
          required={true}
          value={form.submonto}
          onChange={handleInputChange}
          classInput='md:col-span-3'
        />

        <InputField
          type='text'
          label='Monto total (calculado)'
          name='monto'
          required={true}
          value={form.monto}
          disabled={true}
          classInput='md:col-span-3'
        />
      </div>
      <div className='mt-5'>
        <button
          type='submit'
          className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm cursor-pointer transition-all'
        >
          Calcular pago
        </button>
      </div>
    </form>
  )
}
