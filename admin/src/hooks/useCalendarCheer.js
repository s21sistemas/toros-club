import { useEffect, useMemo, useState } from 'react'
import { useCalendarStore } from '../store/useCalendarStore'
import dayjs from 'dayjs'
import { useAuth } from './useAuth'

export const useCalendarCheer = () => {
  const { user } = useAuth()
  const cheerleaders = useCalendarStore((state) => state.cheerleaders)
  const getDataPaymentsCheer = useCalendarStore(
    (state) => state.getDataPaymentsCheer
  )

  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    getDataPaymentsCheer()
  }, [])

  useEffect(() => {
    if (user?.coordinadora_porristas) {
      const porristas = user.porristaId.map((p) => p.value)

      const paymentFilter = cheerleaders.filter((pago) =>
        porristas.includes(pago.porristaId)
      )

      setFilterData(paymentFilter)
    } else {
      setFilterData(cheerleaders)
    }
  }, [cheerleaders])

  const eventsCheerleaders = useMemo(() => {
    return filterData.map((payment) => {
      return {
        title: payment.nombre,
        start: dayjs(`${payment.fecha_regis}T00:00:00`).toDate(),
        end: dayjs(`${payment.fecha_regis}T11:59:59`).toDate(),
        coach: payment.coach,
        ins: payment.ins,
        pago_ins: payment.fecha_ins
          ? dayjs(payment.fecha_ins).format('LL')
          : 'No ha pagado',
        pago_coach: payment.fecha_coach
          ? dayjs(payment.fecha_coach).format('LL')
          : 'No ha pagado'
      }
    })
  }, [filterData])

  return {
    eventsCheerleaders
  }
}
