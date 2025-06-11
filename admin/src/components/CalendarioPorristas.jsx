import { Link } from 'react-router'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import { ChevronRight } from 'lucide-react'
import { AlertaCard } from './AlertaCard'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'dayjs/locale/es'
import { useCalendarCheer } from '../hooks/useCalendarCheer'
import { useState } from 'react'
import { ModalCalendar } from './modals/ModalCalendar'
import { GlosarioColoresCalendario } from './GlosarioColoresCalendario'

dayjs.locale('es')

const localizer = dayjsLocalizer(dayjs)

export const CalendarioPorristas = () => {
  const { eventsCheerleaders } = useCalendarCheer()
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
      const url = `/pagos-porristas?nombre=${encodeURIComponent(nombre)}`
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

  return (
    <>
      {toggle && <ModalCalendar info={info} closeModal={toggleModal} />}
      <div className='mb-3'>
        <AlertaCard text='Calendario de pagos de porristas' />
      </div>

      <GlosarioColoresCalendario />

      <div className='w-full h-[600px]'>
        <Calendar
          views={['month']}
          components={components}
          events={eventsCheerleaders}
          localizer={localizer}
        />
      </div>

      <div className='mt-4 text-center'>
        <Link
          to='/pagos-porristas'
          className='bg-[#3674B5] text-white py-1 px-3 rounded-md hover:bg-[#2a598b] transition-all flex mx-auto items-center max-w-max'
        >
          Ir a la sección de pagos
          <ChevronRight />
        </Link>
      </div>
    </>
  )
}
