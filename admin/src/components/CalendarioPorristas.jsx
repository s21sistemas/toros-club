import { Link } from 'react-router'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import { ChevronRight } from 'lucide-react'
import { AlertaCard } from './AlertaCard'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'dayjs/locale/es'
import { useCalendar } from '../hooks/useCalendar'
import { useState } from 'react'
import { ModalCalendar } from './modals/ModalCalendar'
import { GlosarioColoresCalendario } from './GlosarioColoresCalendario'

dayjs.locale('es')

const localizer = dayjsLocalizer(dayjs)

export const CalendarioPorristas = () => {
  const { eventsCheerleaders } = useCalendar()
  const [toggle, setToggle] = useState(false)
  const [info, setInfo] = useState({})

  const toggleModal = (props) => {
    if (props.event) {
      const pago_ins = props.event.pago_ins
      const pago_coach = props.event.pago_coach
      const nombre = props.event.title
      const coach = props.event.coach
      const ins = props.event.ins
      const url = `/pagos-porristas?nombre=${nombre}`
      setInfo({ nombre, pago_ins, pago_coach, coach, ins, url })
    }

    setToggle(!toggle)
  }

  const components = {
    event: (props) => {
      const ins = props.event.ins
      const coach = props.event.coach

      if (ins === 'pendiente' && coach === 'pendiente') {
        return (
          <div
            className='bg-red-600 px-2 rounded-sm'
            onClick={() => toggleModal(props)}
          >
            {props.title}
          </div>
        )
      }

      if (ins === 'pagado' && coach === 'pagado') {
        return (
          <div
            className='bg-green-600 px-2 rounded-sm'
            onClick={() => toggleModal(props)}
          >
            {props.title}
          </div>
        )
      }

      if (ins === 'pendiente' && coach === 'pagado') {
        return (
          <div
            className='bg-gradient-to-r from-red-600 to-green-600 px-2 rounded-sm'
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
