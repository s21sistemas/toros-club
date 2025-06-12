import { useMemo } from 'react'
import { useTableStore } from '../store/useTableStore'
import dayjs from 'dayjs'
import { useLocation } from 'react-router'

export const useTable = () => {
  const { pathname } = useLocation()
  const data = useTableStore((state) => state.data)
  const itemsPerPage = useTableStore((state) => state.itemsPerPage)
  const filterKeys = useTableStore((state) => state.filterKeys)
  const searchTerm = useTableStore((state) => state.searchTerm)
  const currentPage = useTableStore((state) => state.currentPage)
  const setData = useTableStore((state) => state.setData)
  const setSearchTerm = useTableStore((state) => state.setSearchTerm)
  const setCurrentPage = useTableStore((state) => state.setCurrentPage)

  // Filtrar los datos
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    return data.filter((item) =>
      filterKeys.some((key) =>
        item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm, filterKeys])

  // Paginación
  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / itemsPerPage),
    [filteredData, itemsPerPage]
  )
  const indexOfLastItem = useMemo(
    () => currentPage * itemsPerPage,
    [currentPage, itemsPerPage]
  )
  const indexOfFirstItem = useMemo(
    () => indexOfLastItem - itemsPerPage,
    [indexOfLastItem, itemsPerPage]
  )
  const currentData = useMemo(
    () => filteredData.slice(indexOfFirstItem, indexOfLastItem),
    [filteredData, indexOfFirstItem, indexOfLastItem]
  )

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleClass = (item, columnKey) => {
    const actually = dayjs()
    const limit = item.fecha_limite ? dayjs(item.fecha_limite) : null
    const estatus = item[columnKey]

    if (['pagado', 'pagada', 'Pagado', 'Pagada'].includes(estatus)) {
      return 'bg-green-700'
    }

    if (
      ['cancelada', 'Cancelada', 'cancelado', 'Cancelado'].includes(estatus)
    ) {
      return 'bg-[#e89b0b]'
    }

    if (pathname === '/pagos-jugadores' || pathname === '/pagos-porristas') {
      const abonoIns = item.pagos[0]?.abonos?.length
      const abonoCoach = item.pagos[1]?.abonos?.length
      const abonoTun = item.pagos[2]?.abonos?.length
      const abonoBot = item.pagos[3]?.abonos?.length

      const coachingPayment = item.pagos?.find(
        (pago) => pago.tipo === 'Coaching'
      )

      if (columnKey === 'inscripcion' && abonoIns > 0) {
        return 'bg-gradient-to-r from-green-700 to-red-500'
      }

      if (columnKey === 'tunel' && abonoTun > 0) {
        return 'bg-gradient-to-r from-green-700 to-red-500'
      }

      if (columnKey === 'botiquin' && abonoBot > 0) {
        return 'bg-gradient-to-r from-green-700 to-red-500'
      }

      if (
        columnKey === 'coacheo' &&
        coachingPayment?.fecha_limite &&
        dayjs(coachingPayment.fecha_limite).isAfter(actually)
      ) {
        return 'bg-[#e89b0b]'
      }

      if (
        columnKey === 'coacheo' &&
        abonoCoach > 0 &&
        dayjs(coachingPayment.fecha_final).isAfter(actually)
      ) {
        return 'bg-gradient-to-r from-green-700 to-red-500'
      }

      if (
        columnKey === 'coacheo' &&
        (!coachingPayment?.fecha_limite ||
          dayjs(coachingPayment.fecha_limite).isBefore(actually))
      ) {
        return 'bg-red-600/80'
      }

      if (
        columnKey === 'inscripcion' &&
        item.prorroga == 'true' &&
        limit &&
        actually.isBefore(limit)
      ) {
        return 'bg-[#e89b0b]'
      }
    }

    return 'bg-red-600/80'
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2) // Convierte objetos en texto legible
    }
    return value
  }

  return {
    setData,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    currentData,
    filteredData,
    goToPage,
    setCurrentPage,
    handleClass,
    formatValue
  }
}
