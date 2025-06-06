import { Link } from 'react-router'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import { BookmarkX, ChevronRight, Funnel } from 'lucide-react'
import { AlertaCard } from './AlertaCard'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'dayjs/locale/es'
import { useCalendarPlayers } from '../hooks/useCalendarPlayers'
import { useState } from 'react'
import { ModalCalendar } from './modals/ModalCalendar'
import { GlosarioColoresCalendario } from './GlosarioColoresCalendario'
import { InputField } from './InputField'
import { useModal } from '../hooks/useModal'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'

dayjs.locale('es')

const localizer = dayjsLocalizer(dayjs)

export const CalendarioJugadores = () => {
  const { user } = useAuth()
  const { view, formData, handleInputChange, categoriaOptions } = useModal()

  const { eventsPlayers, loadOptionsTemporadas, filterByTempCat, clearFilter } =
    useCalendarPlayers()
  const [toggle, setToggle] = useState(false)
  const [info, setInfo] = useState({})

  const toggleModal = (props) => {
    if (props.event) {
      const fecha_restring = dayjs(props.event.fecha_restring)
      const haceDosSemanas = dayjs().subtract(2, 'week')

      const restringir = fecha_restring.isBefore(haceDosSemanas)

      const pago_ins = props.event.pago_ins
      const pago_coach = props.event.pago_coach
      const limite_ins = dayjs(props.event.limite_ins).format('LL')
      const limite_coach = dayjs(props.event.limite_coach).format('LL')
      const nombre = props.event.title
      const coach = props.event.coach
      const ins = props.event.ins
      const url = `/pagos-jugadores?nombre=${encodeURIComponent(nombre)}`
      setInfo({
        nombre,
        limite_ins,
        limite_coach,
        pago_ins,
        pago_coach,
        coach,
        ins,
        url,
        restringir
      })
    }

    setToggle(!toggle)
  }

  const components = {
    event: (props) => {
      const actually = dayjs()
      const fecha_coach = dayjs(props.event.limite_coach)
      const limit = actually.isBefore(fecha_coach)

      if (props.event.ins === 'pendiente' && limit) {
        return (
          <div
            className='bg-gradient-to-r from-red-600 to-green-600 px-2 rounded-sm'
            onClick={() => toggleModal(props)}
          >
            {props.title}
          </div>
        )
      } else if (props.event.ins === 'pendiente') {
        return (
          <div
            className='bg-red-600 px-2 rounded-sm'
            onClick={() => toggleModal(props)}
          >
            {props.title}
          </div>
        )
      } else if (props.event.ins === 'pagado' && limit) {
        return (
          <div
            className='bg-green-600 px-2 rounded-sm'
            onClick={() => toggleModal(props)}
          >
            {props.title}
          </div>
        )
      } else {
        return (
          <div
            className='bg-gradient-to-r from-green-600 to-red-600 px-2 rounded-sm'
            onClick={() => toggleModal(props)}
          >
            {props.title}
          </div>
        )
      }
    }
  }

  const handleFiltrar = () => {
    const temporadaId = formData.temporadaId
    const categoria = formData.categoria

    if (!temporadaId || !categoria)
      toast.warning('Selecciona una temporada y una categoría')

    filterByTempCat(temporadaId, categoria)
  }

  const handleClearFilter = () => {
    handleInputChange({ target: { name: 'temporadaId', value: null } })
    handleInputChange({ target: { name: 'categoria', value: null } })
    clearFilter()
  }

  return (
    <>
      {toggle && (
        <ModalCalendar info={info} closeModal={toggleModal} jugador={true} />
      )}

      <div className='mb-3'>
        <AlertaCard text='Calendario de pagos de jugadores' />
      </div>

      <GlosarioColoresCalendario />

      {!user.coordinadora_jugadores && (
        <div className='mb-6 bg-white shadow-md rounded-md p-4'>
          <div className='mb-4'>
            <AlertaCard text='Puedes filtrar a los jugadores por temporada y categorías' />
          </div>

          <div className='mb-4'>
            <InputField
              type='async'
              label='Selecciona la temporada'
              name='temporadaId'
              required={true}
              value={formData.temporadaId}
              onChange={handleInputChange}
              disabled={view}
              loadOptions={loadOptionsTemporadas}
            />
          </div>

          {formData.temporadaId?.value !== '' && (
            <InputField
              type='select'
              label='Selecciona la categoría'
              name='categoria'
              required={true}
              value={formData.categoria}
              opcSelect={categoriaOptions}
              onChange={handleInputChange}
              disabled={view}
            />
          )}

          <div className='flex flex-col md:flex-row gap-2 items-center justify-center'>
            <button
              onClick={handleFiltrar}
              className='rounded-sm text-white font-medium py-2 px-3 bg-[#328E6E] hover:bg-[#24644e] transition-all cursor-pointer mt-4 flex items-center gap-2'
            >
              <Funnel className='w-4 h-4' />
              Filtrar jugadores por categoría
            </button>
            <button
              onClick={handleClearFilter}
              className='rounded-sm text-white font-medium py-2 px-3 bg-[#E78B48] hover:bg-[#c4763e] transition-all cursor-pointer mt-4 flex items-center gap-2'
            >
              <BookmarkX className='w-5 h-5' />
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      <div className='w-full h-[600px]'>
        <Calendar
          views={['month']}
          components={components}
          events={eventsPlayers}
          localizer={localizer}
          popup={true}
        />
      </div>
      <div className='mt-4 text-center'>
        <Link
          to='/pagos-jugadores'
          className='bg-[#3674B5] text-white py-1 px-3 rounded-md hover:bg-[#2a598b] transition-all flex mx-auto items-center max-w-max'
        >
          Ir a la sección de pagos
          <ChevronRight />
        </Link>
      </div>
    </>
  )
}
