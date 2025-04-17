import { useEffect, useMemo } from 'react'
import { useCalendarStore } from '../store/useCalendarStore'
import { useTemporadasStore } from '../store/useTemporadasStore'
import dayjs from 'dayjs'

export const useCalendar = () => {
  const players = useCalendarStore((state) => state.players)
  const cheerleaders = useCalendarStore((state) => state.cheerleaders)
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )
  const getDataPaymentsPlayer = useCalendarStore(
    (state) => state.getDataPaymentsPlayer
  )
  const getPlayersByTempCat = useCalendarStore(
    (state) => state.getPlayersByTempCat
  )
  const getDataPaymentsCheer = useCalendarStore(
    (state) => state.getDataPaymentsCheer
  )

  useEffect(() => {
    getDataPaymentsPlayer()
    getDataPaymentsCheer()
  }, [])

  const loadOptionsTemporadas = async () => {
    try {
      const data = await getDataTemporadas()
      const info = data.map((temp) => ({
        value: temp.id,
        label: temp.temporada
      }))
      info.unshift({ value: '', label: 'Selecciona una opción' })
      return info
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  const filterByTempCat = async (temporadaId, categoria) => {
    if (!temporadaId || !categoria) return

    getPlayersByTempCat(temporadaId, categoria)
  }

  const clearFilter = () => {
    getDataPaymentsPlayer()
  }

  const eventsPlayers = useMemo(() => {
    return players.map((payment) => ({
      title: payment.nombre,
      start: dayjs(`${payment.fecha_regis}T00:00:00`).toDate(),
      end: dayjs(`${payment.fecha_regis}T11:59:59`).toDate(),
      coach: payment.coach,
      ins: payment.ins,
      limite_ins: dayjs(payment.fecha_ins),
      limite_coach: dayjs(payment.fecha_coach),
      fecha_restring: dayjs(payment.fecha_pago_coach),
      pago_ins: payment.fecha_pago_ins
        ? dayjs(payment.fecha_pago_ins).format('LL')
        : 'No ha pagado',
      pago_coach: payment.fecha_pago_coach
        ? dayjs(payment.fecha_pago_coach).format('LL')
        : 'No ha pagado'
    }))
  }, [players])

  const eventsCheerleaders = useMemo(() => {
    return cheerleaders.map((payment) => {
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
  }, [cheerleaders])

  return {
    eventsPlayers,
    eventsCheerleaders,
    loadOptionsTemporadas,
    filterByTempCat,
    clearFilter
  }
}
