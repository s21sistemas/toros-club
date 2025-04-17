import { CalendarioJugadores } from '../components/CalendarioJugadores'
import { CalendarioPorristas } from '../components/CalendarioPorristas'

const CalendarioPagosPage = () => {
  return (
    <div>
      <div className='mb-6'>
        <CalendarioJugadores />
      </div>

      <hr />

      <div className='mt-6'>
        <CalendarioPorristas />
      </div>
    </div>
  )
}
export default CalendarioPagosPage
