import { useEffect, useMemo, useState } from 'react'
import { useCalendarStore } from '../store/useCalendarStore'
import { useTemporadasStore } from '../store/useTemporadasStore'
import dayjs from 'dayjs'
import { useAuth } from './useAuth'

export const useCalendarPlayers = () => {
  const { user } = useAuth()
  const players = useCalendarStore((state) => state.players)
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )
  const getDataPaymentsPlayer = useCalendarStore(
    (state) => state.getDataPaymentsPlayer
  )
  const getPlayersByTempCat = useCalendarStore(
    (state) => state.getPlayersByTempCat
  )

  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    getDataPaymentsPlayer()
  }, [])

  useEffect(() => {
    if (user?.coordinadora_jugadores) {
      const categoriasUsuario = user.categorias.map((c) =>
        c.label.toLowerCase()
      )

      const paymentFilter = players.filter((pay) =>
        categoriasUsuario.some((cat) =>
          pay.categoria?.toLowerCase().includes(cat)
        )
      )

      setFilterData(paymentFilter)
    } else {
      setFilterData(players)
    }
  }, [players])

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
    return filterData.map((payment) => ({
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
  }, [filterData])

  return {
    eventsPlayers,
    loadOptionsTemporadas,
    filterByTempCat,
    clearFilter
  }
}
