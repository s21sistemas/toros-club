import { useEffect, useState } from 'react'
import { getCategoriaByTemp, getCategoriaByTempByNac } from '../api/categorias'
import { useArticuloStore } from '../store/useArticuloStore'
import { useModalStore } from '../store/useModalStore'
import { useLocation } from 'react-router'
import { obtenerCostoTemporadaCategoria } from '../api/costos-jugador'
import { obtenerCostoTemporada as obtCostTempPorri } from '../api/costos-porrista'
import { toast } from 'sonner'
import { getUserByUID } from '../api/players'
import dayjs from 'dayjs'

export const useModal = () => {
  const modalType = useModalStore((state) => state.modalType)
  const setFormData = useModalStore((state) => state.setFormData)
  const setNestedFormData = useModalStore((state) => state.setNestedFormData)
  const formData = useModalStore((state) => state.formData)
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const currentItem = useModalStore((state) => state.currentItem)
  const getArticulo = useArticuloStore((state) => state.getArticulo)

  const [temp, setTemp] = useState('')
  const [sexo, setSexo] = useState('')
  const [cate, setCate] = useState('')

  const view = modalType === 'view'
  const add = modalType === 'add'
  const edit = modalType === 'edit'
  const deleteModal = modalType === 'delete'
  const document = modalType === 'view' || modalType === 'edit'

  const [categoriaOptions, setCategoriaOptions] = useState([])

  const [categoriaOptionsFilter, setCategoriaOptionsFilter] = useState([])
  const [loadOptionsCategorias, setLoadOptionsCategorias] = useState(
    () => async () => []
  )

  const getLoadOptionsCategorias = (temporadaId) => async () => {
    if (!temporadaId) return []

    try {
      const categorias = await getCategoriaByTemp(temporadaId)

      return categorias.map((cat) => ({
        value: cat.value,
        label: cat.label
      }))
    } catch (error) {
      console.error('Error cargando categorías:', error)
      return []
    }
  }

  const { pathname } = useLocation()

  const recalcularPagoCoaching = () => {
    const pago = formData.pagos[1] || {}

    const submonto = parseFloat(pago.submonto) || 0
    const descuento = parseFloat(pago.descuento) || 0

    const fechaInicialP = pago?.fecha_inicial || formData.fecha_inicial

    const fechaInicial = dayjs(fechaInicialP, 'YYYY-MM-DD', true)
    const fechaFinal = dayjs(pago.fecha_final, 'YYYY-MM-DD', true)

    if (fechaInicial.isAfter(fechaFinal)) {
      toast.warning('La fecha final no puede ser antes a la fecha inicial')
      setNestedFormData('pagos.1.fecha_final', null)
    }

    // Si fechas inválidas, asumimos 1 semana
    const semanas =
      fechaInicial.isValid() && fechaFinal.isValid()
        ? fechaFinal.diff(fechaInicial, 'week')
        : 1

    const montoBruto = semanas * submonto
    const montoConDescuento = montoBruto - descuento
    const montoFinal = montoConDescuento > 0 ? montoConDescuento : 0

    setNestedFormData('pagos.1.monto', montoFinal)

    // Total abonado y restante
    const totalAbonado = parseFloat(pago.total_abonado) || 0
    const totalRestante = montoFinal - totalAbonado

    setNestedFormData('pagos.1.total_restante', totalRestante)

    // SOLO COACHING - AJENO A LOS TOTALES GENERALES
    setNestedFormData('monto_pagado_coach', totalAbonado)
    setNestedFormData('monto_pendiente_coach', totalRestante)
  }

  const recalcularTotalesGlobales = () => {
    const pagosTotalPendiente = parseFloat(formData.pagos_total_pendiente || 0)
    const pagosTotalPagado = parseFloat(formData.pagos_total_pagado || 0)
    const montoPendienteCoach = parseFloat(formData.monto_pendiente_coach || 0)
    const historialPagadoCoach = parseFloat(
      formData.historial_total_pagado || 0
    )

    setFormData(
      'monto_total_pendiente',
      pagosTotalPendiente + montoPendienteCoach
    )
    setFormData('monto_total_pagado', pagosTotalPagado + historialPagadoCoach)
  }

  const recalcularMontoTotal = () => {
    const pagos = formData.pagos || []

    const montoInscripcion = parseFloat(pagos[0]?.monto) || 0
    const montoCoaching = pagos[1]?.cancelar_coach
      ? 0
      : parseFloat(pagos[1]?.monto) || 0
    const montoTunel = pagos[2]?.cancelar_tunel
      ? 0
      : parseFloat(pagos[2]?.monto) || 0
    const montoBotiquin = pagos[3]?.cancelar_botiquin
      ? 0
      : parseFloat(pagos[3]?.monto) || 0

    setFormData(
      'monto_total',
      montoInscripcion + montoCoaching + montoTunel + montoBotiquin
    )
  }

  useEffect(() => {
    const fetchCategorias = async () => {
      const temporadaId = formData.temporadaId
      if (temporadaId) {
        const categorias = await getCategoriaByTemp(temporadaId)
        categorias.unshift({ value: '', label: 'Selecciona una opción' })
        setCategoriaOptions(categorias)
      }
    }

    fetchCategorias()
  }, [formData.temporadaId])

  useEffect(() => {
    const type = modalType
    if (
      (type === 'view' || type === 'edit') &&
      pathname === '/pagos-jugadores'
    ) {
      const preciosTemporadaCategoria = async () => {
        const temporadaId = formData.temporadaId
        const categoria = formData.categoria

        const [data] = await obtenerCostoTemporadaCategoria(
          temporadaId,
          categoria
        )

        const subMontoIns = formData.cambio_inscripcion
          ? formData.pagos[0]?.submonto || 0
          : data?.inscripcion || 0

        const subMontoCoach = formData.cambio_coach
          ? formData.pagos[1]?.submonto || 0
          : data?.coaching || 0

        const montoTunel = parseFloat(data?.tunel || 0)
        const montoBoti = parseFloat(data?.botiquin || 0)

        setFormData('pagos.0.submonto', parseFloat(subMontoIns))
        setFormData('pagos.1.submonto', parseFloat(subMontoCoach))
        setFormData('pagos.2.monto', montoTunel)
        setFormData('pagos.3.monto', montoBoti)

        // Descuentos inscripción
        const submonto = parseFloat(formData.pagos[0]?.submonto || 0)
        const descuento = parseFloat(formData.pagos[0]?.descuento || 0)
        const beca = parseFloat(formData.pagos[0]?.beca || 0)

        // Calcular monto con descuento y beca de inscripción
        const descuentoAplicado = submonto * (descuento / 100)
        const becaAplicada = submonto * (beca / 100)
        const montoActualizado = submonto - descuentoAplicado - becaAplicada
        setFormData('pagos.0.monto', montoActualizado || 0)

        // Descuentos coaching
        const fechaInicialCoach =
          formData.pagos[1]?.fecha_inicial || formData.fecha_inicial
        const fechaFinalCoach = formData.pagos[1]?.fecha_final
        const descuentoCoach = parseFloat(formData.pagos[1]?.descuento || 0)

        let montoActualizadoCoach = 0

        // Calcular monto con descuento de coaching
        if (fechaFinalCoach) {
          const ini = dayjs(fechaInicialCoach, 'YYYY-MM-DD', true)
          const fin = dayjs(fechaFinalCoach, 'YYYY-MM-DD', true)

          if (ini.isValid() && fin.isValid() && !ini.isAfter(fin)) {
            const semanas = fin.diff(ini, 'week')
            const montoBruto = semanas * subMontoCoach
            montoActualizadoCoach = montoBruto - descuentoCoach
          } else {
            montoActualizadoCoach = subMontoCoach - descuentoCoach
          }
        } else {
          montoActualizadoCoach = subMontoCoach - descuentoCoach
        }
        setFormData('pagos.1.monto', montoActualizadoCoach || 0)

        // Calculos de los restantes totales
        if (formData.pagos?.[0]?.estatus === 'pagado') {
          setNestedFormData('pagos.0.total_restante', '0')
        } else {
          const totalAbonoIns = parseFloat(
            formData.pagos?.[0]?.total_abonado || 0
          )
          const totalRestanteIns = montoActualizado - totalAbonoIns
          setFormData('pagos.0.total_restante', totalRestanteIns)
        }

        if (formData.pagos?.[1]?.estatus === 'pagado') {
          setNestedFormData('pagos.1.total_restante', '0')
        } else {
          const totalAbonoCoach = parseFloat(
            formData.pagos?.[1]?.total_abonado || 0
          )
          const totalRestanteCoach = montoActualizadoCoach - totalAbonoCoach
          setFormData('pagos.1.total_restante', totalRestanteCoach)
        }

        if (formData.pagos?.[2]?.estatus === 'pagado') {
          setNestedFormData('pagos.2.total_restante', '0')
        } else {
          const totalAbonoTunel = parseFloat(
            formData.pagos?.[2]?.total_abonado || 0
          )
          const totalRestanteTunel = montoTunel - totalAbonoTunel
          setFormData('pagos.2.total_restante', totalRestanteTunel)
        }

        if (formData.pagos?.[3]?.estatus === 'pagado') {
          setNestedFormData('pagos.3.total_restante', '0')
        } else {
          const totalAbonoBoti = parseFloat(
            formData.pagos?.[3]?.total_abonado || 0
          )
          const totalRestanteBoti = montoBoti - totalAbonoBoti
          setFormData('pagos.3.total_restante', totalRestanteBoti)
        }

        // === CALCULAR RESTANTES Y TOTALES ===

        // 1. Totales normales (Inscripción, Túnel, Botiquín)
        const tunelCancelado = formData.pagos[2]?.cancelar_tunel || false
        const botiquinCancelado = formData.pagos[3]?.cancelar_botiquin || false

        const insRestante = parseFloat(formData.pagos[0].total_restante || 0)
        const tunelRestante = tunelCancelado
          ? 0
          : parseFloat(formData.pagos[2].total_restante || 0)
        const botiquinRestante = botiquinCancelado
          ? 0
          : parseFloat(formData.pagos[3].total_restante || 0)

        const montoInscripcion = parseFloat(montoActualizado || 0)
        const montoTn = tunelCancelado ? 0 : parseFloat(montoTunel || 0)
        const montoBtq = botiquinCancelado ? 0 : parseFloat(montoBoti || 0)

        const totalPendiente = insRestante + tunelRestante + botiquinRestante
        const montoTotal = montoInscripcion + montoTn + montoBtq
        const totalPagado = montoTotal - totalPendiente

        setFormData('pagos_total_pendiente', totalPendiente)
        setFormData('pagos_total_pagado', totalPagado)
        setFormData('pagos_total', montoTotal)

        // 2. Totales de coaching (ajenos)
        const coachCancelado = formData.pagos[1]?.cancelar_coach || false
        const restanteCoach = coachCancelado
          ? 0
          : parseFloat(formData.pagos[1]?.total_restante || 0)
        const abonadoCoach = parseFloat(formData.pagos[1]?.total_abonado || 0)

        setFormData('monto_pendiente_coach', restanteCoach)
        setFormData('monto_pagado_coach', abonadoCoach)
      }

      preciosTemporadaCategoria()
    }
  }, [
    formData.cambio_coach,
    formData.cambio_inscripcion,
    formData.categoria,
    formData.fecha_inicial,
    formData.pagos,
    formData.temporadaId,
    modalType,
    pathname,
    setFormData,
    setNestedFormData
  ])

  useEffect(() => {
    const type = modalType
    if (
      (type === 'view' || type === 'edit') &&
      pathname === '/pagos-porristas'
    ) {
      const preciosTemporadaCategoria = async () => {
        const temporadaId = formData.temporadaId

        const [data] = await obtCostTempPorri(temporadaId)

        const subMontoIns = formData.cambio_inscripcion
          ? formData.pagos[0]?.submonto || 0
          : data?.inscripcion || 0

        const subMontoCoach = formData.cambio_coach
          ? formData.pagos[1]?.submonto || 0
          : data?.coaching || 0

        setFormData('pagos.0.submonto', parseFloat(subMontoIns))
        setFormData('pagos.1.submonto', parseFloat(subMontoCoach))

        // Descuentos inscripción
        const submonto = parseFloat(formData.pagos[0]?.submonto || 0)
        const descuento = parseFloat(formData.pagos[0]?.descuento || 0)
        const beca = parseFloat(formData.pagos[0]?.beca || 0)

        // Calcular monto con descuento y beca de inscripción
        const descuentoAplicado = submonto * (descuento / 100)
        const becaAplicada = submonto * (beca / 100)
        const montoActualizado = submonto - descuentoAplicado - becaAplicada
        setFormData('pagos.0.monto', montoActualizado || 0)

        // Descuentos coaching
        const fechaInicialCoach =
          formData.pagos[1]?.fecha_inicial || formData.fecha_inicial
        const fechaFinalCoach = formData.pagos[1]?.fecha_final
        const descuentoCoach = parseFloat(formData.pagos[1]?.descuento || 0)

        let montoActualizadoCoach = 0

        // Calcular monto con descuento de coaching
        if (fechaFinalCoach) {
          const ini = dayjs(fechaInicialCoach, 'YYYY-MM-DD', true)
          const fin = dayjs(fechaFinalCoach, 'YYYY-MM-DD', true)

          if (ini.isValid() && fin.isValid() && !ini.isAfter(fin)) {
            const semanas = fin.diff(ini, 'week')
            const montoBruto = semanas * subMontoCoach
            montoActualizadoCoach = montoBruto - descuentoCoach
          } else {
            montoActualizadoCoach = subMontoCoach - descuentoCoach
          }
        } else {
          montoActualizadoCoach = subMontoCoach - descuentoCoach
        }
        setFormData('pagos.1.monto', montoActualizadoCoach || 0)

        // Calculos de los restantes totales
        if (formData.pagos?.[0]?.estatus === 'pagado') {
          setNestedFormData('pagos.0.total_restante', '0')
        } else {
          const totalAbonoIns = parseFloat(
            formData.pagos?.[0]?.total_abonado || 0
          )
          const totalRestanteIns = montoActualizado - totalAbonoIns
          setFormData('pagos.0.total_restante', totalRestanteIns)
        }

        if (formData.pagos?.[1]?.estatus === 'pagado') {
          setNestedFormData('pagos.1.total_restante', '0')
        } else {
          const totalAbonoCoach = parseFloat(
            formData.pagos?.[1]?.total_abonado || 0
          )
          const totalRestanteCoach = montoActualizadoCoach - totalAbonoCoach
          setFormData('pagos.1.total_restante', totalRestanteCoach)
        }

        // 1. Totales normales (Inscripción)
        const insRestante = parseFloat(formData.pagos[0].total_restante || 0)
        const montoInscripcion = parseFloat(montoActualizado || 0)

        const totalPagado = montoInscripcion - insRestante

        setFormData('pagos_total_pendiente', insRestante)
        setFormData('pagos_total_pagado', totalPagado)
        setFormData('pagos_total', montoInscripcion)

        // 2. Totales de coaching (ajenos)
        const coachCancelado = formData.pagos[1]?.cancelar_coach || false
        const restanteCoach = coachCancelado
          ? 0
          : parseFloat(formData.pagos[1]?.total_restante || 0)
        const abonadoCoach = parseFloat(formData.pagos[1]?.total_abonado || 0)

        setFormData('monto_pendiente_coach', restanteCoach)
        setFormData('monto_pagado_coach', abonadoCoach)
      }

      preciosTemporadaCategoria()
    }
  }, [
    formData.cambio_coach,
    formData.cambio_inscripcion,
    formData.fecha_inicial,
    formData.pagos,
    formData.temporadaId,
    modalType,
    pathname,
    setFormData,
    setNestedFormData
  ])

  useEffect(() => {
    const type = modalType
    if (
      (type === 'view' || type === 'edit') &&
      (pathname === '/jugadores' || pathname === '/porristas')
    ) {
      const datosTutor = async () => {
        const uid = formData.uid
        const data = await getUserByUID(uid.value)
        setFormData('celular_tutor', data.celular)
        setFormData('correo_tutor', data.correo)
      }

      datosTutor()
    }
  }, [])

  useEffect(() => {
    recalcularTotalesGlobales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.pagos_total_pendiente,
    formData.pagos_total_pagado,
    formData.monto_pendiente_coach,
    formData.monto_pagado_coach
  ])

  useEffect(() => {
    recalcularMontoTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData?.pagos?.[0]?.monto,
    formData?.pagos?.[1]?.monto,
    formData?.pagos?.[2]?.monto,
    formData?.pagos?.[3]?.monto
  ])

  const handleAbonoChange = (name, value, index) => {
    const nuevaCantidad = parseFloat(value || 0)
    const totalRestante = parseFloat(
      formData?.pagos[index]?.total_restante || 0
    )
    const cantidadAnterior = parseFloat(formData[name] || 0)

    const pagadoActual =
      index === 1
        ? parseFloat(formData.monto_pagado_coach || 0)
        : parseFloat(formData.pagos_total_pagado || 0)

    const pendienteActual =
      index === 1
        ? parseFloat(formData.monto_pendiente_coach || 0)
        : parseFloat(formData.pagos_total_pendiente || 0)

    let cantidadFinal = nuevaCantidad

    if (nuevaCantidad > totalRestante) {
      toast.warning('La cantidad supera el total restante')
      cantidadFinal = totalRestante
    }

    // Revertir la cantidad anterior antes de aplicar la nueva
    const pendienteRevertido = pendienteActual + cantidadAnterior
    const pagadoRevertido = pagadoActual - cantidadAnterior

    const nuevoPendiente = pendienteRevertido - cantidadFinal
    const nuevoPagado = pagadoRevertido + cantidadFinal

    setFormData(name, cantidadFinal)
    if (index === 1) {
      setFormData('monto_pendiente_coach', nuevoPendiente)
      setFormData('monto_pagado_coach', nuevoPagado)
    } else {
      setFormData('pagos_total_pendiente', nuevoPendiente)
      setFormData('pagos_total_pagado', nuevoPagado)
    }
  }

  const handleInputChange = async (e, actionMeta) => {
    let name, value

    if (e.target) {
      ;({ name, value } = e.target)
    } else {
      name = actionMeta.name
      value = e || []
    }

    setFormData(name, value)

    setSexo(name === 'sexo' ? value : sexo)
    setTemp(name === 'temporadaId' ? value : temp)
    setCate(name === 'categoria' ? value : cate)

    if (name === 'articuloId') {
      const data = await getArticulo(value.value)
      const precio = parseFloat(data.precio_compra) || 0

      setFormData('precio_articulo', precio)
    } else if (name === 'cantidad_articulos') {
      const precio = formData?.precio_articulo || 0

      const cantidad =
        name === 'cantidad_articulos'
          ? parseInt(value) || 0
          : parseInt(formData?.cantidad_articulos) || 0

      const subtotal = precio * cantidad
      const iva = formData?.iva ? subtotal * 0.16 : 0
      const total = subtotal + iva

      setFormData('subtotal', subtotal)
      setFormData('total', total)
    } else if (name === 'subtotal') {
      const subtotal =
        name === 'subtotal'
          ? parseFloat(value) || 0
          : parseFloat(formData?.subtotal) || 0

      const iva = subtotal * 0.16
      const total = subtotal + iva

      setFormData('subtotal', subtotal)
      setFormData('total', total)
    }

    if (name === 'temporadaId') {
      setTemp(value)

      if (pathname === '/usuarios') {
        const temporadaId = value
        setFormData('categorias', [])

        const loadOptions = getLoadOptionsCategorias(temporadaId)
        setLoadOptionsCategorias(() => loadOptions)
      } else {
        setFormData('categoria', '')
        setCategoriaOptions([{ value: '', label: 'Cargando...' }])

        const categorias = await getCategoriaByTemp(value)
        const opciones = [
          { value: '', label: 'Selecciona una opción' },
          ...categorias.map((c) => ({
            value: c.value,
            label: c.label
          }))
        ]
        setCategoriaOptions(opciones)
      }
    }

    if (name === 'temporadaIdFilter') {
      setCategoriaOptionsFilter([{ value: '', label: 'Cargando...' }])

      const categorias = await getCategoriaByTemp(value)
      const opciones = [
        { value: '', label: 'Selecciona una opción' },
        ...categorias.map((c) => ({
          value: c.value,
          label: c.label
        }))
      ]

      setCategoriaOptionsFilter(opciones)
    }

    if (
      name === 'jugador' &&
      pathname === '/pagos-jugadores' &&
      modalType === 'add'
    ) {
      setFormData('temporadaId', value.temporada)
      setFormData('categoria', value.categoria)

      const costosTemporada = await obtenerCostoTemporadaCategoria(
        value.temporada,
        value.categoria
      )

      const costoInscripcion =
        parseFloat(costosTemporada[0]?.inscripcion) || 500
      const costoCoaching = parseFloat(costosTemporada[0]?.coaching) || 500
      const costoTunel = parseFloat(costosTemporada[0]?.tunel) || 500
      const costoBotiquin = parseFloat(costosTemporada[0]?.botiquin) || 500

      const montoTotal = costoInscripcion + costoTunel + costoBotiquin

      setFormData('pagos.0.submonto', costoInscripcion)
      setFormData('pagos.0.monto', costoInscripcion)
      setFormData('pagos.0.total_restante', costoInscripcion)
      setFormData('pagos.1.submonto', costoCoaching)
      setFormData('pagos.1.monto', costoCoaching)
      setFormData('pagos.1.total_restante', costoCoaching)
      setFormData('pagos.2.monto', costoTunel)
      setFormData('pagos.2.total_restante', costoTunel)
      setFormData('pagos.3.monto', costoBotiquin)
      setFormData('pagos.3.total_restante', costoBotiquin)
      setFormData('pagos_total_pendiente', montoTotal)
      setFormData('pagos_total', montoTotal)
      setFormData('monto_total_pendiente', montoTotal + costoCoaching)
      setFormData('monto_total', montoTotal + costoCoaching)
    }

    if (
      name === 'porrista' &&
      pathname === '/pagos-porristas' &&
      modalType === 'add'
    ) {
      setFormData('temporadaId', value.temporada)

      const costosTemporada = await obtCostTempPorri(value.temporada)

      const costoInscripcion =
        parseFloat(costosTemporada[0]?.inscripcion) || 500
      const costoCoaching = parseFloat(costosTemporada[0]?.coaching) || 500
      const montoTotal = costoInscripcion

      setFormData('pagos.0.submonto', costoInscripcion)
      setFormData('pagos.0.monto', costoInscripcion)
      setFormData('pagos.0.total_restante', costoInscripcion)
      setFormData('pagos.1.submonto', costoCoaching)
      setFormData('pagos.1.monto', costoCoaching)
      setFormData('pagos.1.total_restante', costoCoaching)
      setFormData('pagos_total_pendiente', montoTotal)
      setFormData('pagos_total', montoTotal)
      setFormData('monto_total_pendiente', montoTotal + costoCoaching)
      setFormData('monto_total', montoTotal + costoCoaching)
    }

    if (name === 'uid') {
      const celular = value.celular
      const correo = value.correo

      setFormData('celular_tutor', celular)
      setFormData('correo_tutor', correo)
    }

    const updatedFormData = {
      ...formData,
      [name]: value
    }
    if (
      ['fecha_nacimiento', 'sexo', 'temporadaId'].includes(name) &&
      updatedFormData.fecha_nacimiento &&
      updatedFormData.sexo &&
      updatedFormData.temporadaId
    ) {
      const categoria = await getCategoriaByTempByNac(
        updatedFormData.temporadaId,
        updatedFormData.fecha_nacimiento,
        updatedFormData.sexo
      )

      if (categoria?.[0]) {
        setFormData('categoria', categoria[0])
      }
    }

    if (name === 'cantidad_abono_ins') {
      handleAbonoChange('cantidad_abono_ins', value, 0)
    }

    if (name === 'cantidad_abono_coach') {
      handleAbonoChange('cantidad_abono_coach', value, 1)
    }

    if (name === 'cantidad_abono_tunel') {
      handleAbonoChange('cantidad_abono_tunel', value, 2)
    }

    if (name === 'cantidad_abono_botiquin') {
      handleAbonoChange('cantidad_abono_botiquin', value, 3)
    }
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData(name, checked)

    if (
      name === 'pagos.1.cancelar_coach' ||
      name === 'pagos.2.cancelar_tunel' ||
      name === 'pagos.3.cancelar_botiquin'
    ) {
      const updatedValue = checked === true || checked === 'true'

      // Identificar el índice y el nombre del campo
      const index = parseInt(name.split('.')[1], 10)

      const montoPago = parseFloat(formData.pagos[index]?.monto || 0)
      const pendientePago = parseFloat(
        formData.pagos[index]?.total_restante || 0
      )
      const pagadoPago = parseFloat(formData.pagos[index]?.total_abonado || 0)

      if (index === 1) {
        const pendienteCoach = parseFloat(formData.monto_pendiente_coach || 0)
        const pagadoCoach = parseFloat(formData.monto_pagado_coach || 0)

        let nuevoPendienteCoach = pendienteCoach
        let nuevoPagadoCoach = pagadoCoach

        if (updatedValue) {
          // Cancelado: quitar montos de coach
          nuevoPendienteCoach -= pendientePago
          nuevoPagadoCoach -= pagadoPago
        } else {
          // Reversión del cancelado: volver a agregar montos
          nuevoPendienteCoach += pendientePago
          nuevoPagadoCoach += pagadoPago
        }

        setFormData('monto_pendiente_coach', nuevoPendienteCoach)
        setFormData('monto_pagado_coach', nuevoPagadoCoach)
      } else {
        // === Otros pagos (tunel, botiquín) ===
        let nuevoPendiente = parseFloat(formData.pagos_total_pendiente || 0)
        let nuevoPagado = parseFloat(formData.pagos_total_pagado || 0)
        let nuevoTotal = parseFloat(formData.pagos_total || 0)

        if (updatedValue) {
          // Cancelado: quitar montos de totales
          nuevoTotal -= montoPago
          nuevoPendiente -= pendientePago
          nuevoPagado -= pagadoPago
        } else {
          // Reversión del cancelado: volver a agregar montos
          nuevoTotal += montoPago
          nuevoPendiente += pendientePago
          nuevoPagado += pagadoPago
        }

        setNestedFormData('pagos_total', nuevoTotal)
        setNestedFormData('pagos_total_pendiente', nuevoPendiente)
        setNestedFormData('pagos_total_pagado', nuevoPagado)
      }

      recalcularMontoTotal()
      recalcularTotalesGlobales()
    }
  }

  const handleNestedInputChange = (e) => {
    const { name, value } = e.target
    setNestedFormData(name, value)

    if (
      name === 'pagos.0.submonto' ||
      name === 'pagos.0.descuento' ||
      name === 'pagos.0.beca'
    ) {
      setNestedFormData(name, value)

      // Obtener valores actualizados
      const submonto =
        name === 'pagos.0.submonto'
          ? parseFloat(value) || 0
          : parseFloat(formData.pagos[0]?.submonto) || 0

      const descuento =
        name === 'pagos.0.descuento'
          ? parseFloat(value) || 0
          : parseFloat(formData.pagos[0]?.descuento) || 0

      const beca =
        name === 'pagos.0.beca'
          ? parseFloat(value) || 0
          : parseFloat(formData.pagos[0]?.beca) || 0

      // Calcular monto con descuento y beca
      const descuentoAplicado = submonto * (descuento / 100)
      const becaAplicada = submonto * (beca / 100)
      const montoActualizado = submonto - descuentoAplicado - becaAplicada

      // Actualizar el monto del primer pago
      setNestedFormData('pagos.0.monto', montoActualizado)

      // Actualizar total restante
      const totalRestante =
        montoActualizado - parseFloat(formData?.pagos[0]?.total_abonado || 0)
      setNestedFormData('pagos.0.total_restante', totalRestante)

      // Obtener montos de los otros pagos
      const montoTunel = parseFloat(formData.pagos[2]?.monto) || 0
      const montoBoti = parseFloat(formData.pagos[3]?.monto) || 0

      // Calcular monto total
      const montoTotal = montoActualizado + montoTunel + montoBoti
      setNestedFormData('pagos_total', montoTotal)

      // Calcular pendiente
      const montoTunelPendiente =
        parseFloat(formData.pagos[2]?.total_restante) || 0
      const montoBotiPendiente =
        parseFloat(formData.pagos[3]?.total_restante) || 0

      // Calcular monto total
      const montoTotalPendiente =
        totalRestante + montoTunelPendiente + montoBotiPendiente
      setNestedFormData('pagos_total_pendiente', montoTotalPendiente)

      // Calcular monto pagado
      const montoTotalPagado = montoTotal - montoTotalPendiente
      setNestedFormData('pagos_total_pagado', montoTotalPagado)
    } else if (name.startsWith('pagos.') && name.endsWith('.estatus')) {
      setNestedFormData(name, value)

      const index = parseInt(name.split('.')[1], 10)

      if (index === 1) {
        // === COACHING ===
        const pago = formData.pagos[1]
        const monto = parseFloat(pago.monto || 0)
        const abonado = parseFloat(pago.total_abonado || 0)

        if (value === 'pagado') {
          // Coaching pagado completamente
          setFormData('monto_pagado_coach', monto)
          setFormData('monto_pendiente_coach', 0)
        } else if (value === 'pendiente') {
          const restante = monto - abonado
          setFormData('monto_pagado_coach', abonado)
          setFormData('monto_pendiente_coach', restante)
        }
      } else {
        // === RESTO DE PAGOS ===
        const updatedPagos = [...formData.pagos].map((pago, i) => {
          if (i === index) {
            return { ...pago, estatus: value }
          }
          return pago
        })

        // Calcular montos sin coaching
        let montoTotal = 0
        let totalPagado = 0
        let totalPendiente = 0

        updatedPagos.forEach((pago, i) => {
          if (i !== 1) {
            const monto = parseFloat(pago.monto) || 0
            montoTotal += monto

            if (pago.estatus === 'pagado') {
              totalPagado += monto
            } else if (pago.estatus === 'pendiente') {
              const pendiente = monto - (parseFloat(pago.total_abonado) || 0)
              totalPendiente += pendiente
              totalPagado += parseFloat(pago.total_abonado) || 0
            }
          }
        })

        setNestedFormData('pagos_total', montoTotal)
        setNestedFormData('pagos_total_pagado', totalPagado)
        setNestedFormData('pagos_total_pendiente', totalPendiente)
      }
    } else if (name.startsWith('pagos.') && name.endsWith('.monto')) {
      setNestedFormData(name, value)

      const updatedPagos = [...formData.pagos].map((pago, index) => {
        if (`pagos.${index}.monto` === name) {
          return {
            ...pago,
            monto: parseFloat(value) || 0,
            total_restante: parseFloat(value) || 0 // sincroniza al mismo valor
          }
        }
        return {
          ...pago,
          monto: parseFloat(pago.monto) || 0,
          total_restante: parseFloat(pago.total_restante) || 0
        }
      })

      setFormData('pagos', updatedPagos)

      if (name.startsWith('pagos.1')) {
        const pagoCoach = updatedPagos[1]
        setNestedFormData('monto_pagado_coach', pagoCoach.total_abonado || 0)
        setNestedFormData(
          'monto_pendiente_coach',
          pagoCoach.total_restante || 0
        )
      } else {
        let montoTotal = 0
        let totalPagado = 0
        let totalPendiente = 0

        updatedPagos.forEach((pago, i) => {
          if (i !== 1) {
            montoTotal += pago.monto || 0

            if (pago.estatus === 'pagado') {
              totalPagado += pago.monto
            } else {
              const pendiente = (pago.monto || 0) - (pago.total_abonado || 0)
              totalPendiente += pendiente
              totalPagado += pago.total_abonado || 0
            }
          }
        })

        setNestedFormData('pagos_total', montoTotal)
        setNestedFormData('pagos_total_pagado', totalPagado)
        setNestedFormData('pagos_total_pendiente', totalPendiente)
      }
    } else if (
      name.startsWith('pagos.') &&
      name.endsWith('.abono') &&
      value === 'NO'
    ) {
      const index = parseInt(name.split('.')[1], 10)

      // Mapear índices a los campos específicos
      const abonoFields = [
        'cantidad_abono_ins',
        'cantidad_abono_coach',
        'cantidad_abono_tunel',
        'cantidad_abono_botiquin'
      ]

      const abonoField = abonoFields[index]
      const abono = parseFloat(formData[abonoField] || 0)
      const pendienteActual = parseFloat(formData.pagos_total_pendiente || 0)
      const pagadoActual = parseFloat(formData.pagos_total_pagado || 0)

      const nuevoPendiente = pendienteActual + abono
      const nuevoPagado = pagadoActual - abono

      setFormData(abonoField, 0)
      setFormData('pagos_total_pendiente', nuevoPendiente)
      setFormData('pagos_total_pagado', nuevoPagado)
    }

    if (
      name === 'pagos.1.submonto' ||
      name === 'pagos.1.descuento' ||
      name === 'pagos.1.fecha_inicial' ||
      name === 'pagos.1.fecha_final'
    ) {
      setNestedFormData(name, value)
      setTimeout(() => {
        recalcularPagoCoaching()
      }, 0)
    }

    if (
      name === 'pagos.0.estatus' &&
      value === 'pagado' &&
      formData.pagos[0].abono === 'SI'
    ) {
      setFormData(
        'cantidad_abono_ins',
        parseFloat(formData.pagos[0].total_restante)
      )
      setFormData('fecha_abono_ins', new Date().toISOString().split('T')[0])
      setFormData('metodo_pago_abono_ins', 'efectivo')
    }

    if (
      name === 'pagos.1.estatus' &&
      value === 'pagado' &&
      formData.pagos[1].abono === 'SI'
    ) {
      setFormData(
        'cantidad_abono_coach',
        parseFloat(formData.pagos[1].total_restante)
      )
      setFormData('fecha_abono_coach', new Date().toISOString().split('T')[0])
      setFormData('metodo_pago_abono_coach', 'efectivo')
    }

    if (
      name === 'pagos.2.estatus' &&
      value === 'pagado' &&
      formData.pagos[2].abono === 'SI'
    ) {
      setFormData(
        'cantidad_abono_tunel',
        parseFloat(formData.pagos[2].total_restante)
      )
      setFormData('fecha_abono_tunel', new Date().toISOString().split('T')[0])
      setFormData('metodo_pago_abono_tunel', 'efectivo')
    }

    if (
      name === 'pagos.3.estatus' &&
      value === 'pagado' &&
      formData.pagos[3].abono === 'SI'
    ) {
      setFormData(
        'cantidad_abono_botiquin',
        parseFloat(formData.pagos[3].total_restante)
      )
      setFormData(
        'fecha_abono_botiquin',
        new Date().toISOString().split('T')[0]
      )
      setFormData('metodo_pago_abono_botiquin', 'efectivo')
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (!files.length) return

    const file = files[0]

    setFormData(name, file)
  }

  return {
    view,
    add,
    edit,
    deleteModal,
    document,
    modalType,
    setFormData,
    formData,
    openModal,
    closeModal,
    currentItem,
    setNestedFormData,
    categoriaOptions,
    categoriaOptionsFilter,
    loadOptionsCategorias,
    handleInputChange,
    handleFileChange,
    handleNestedInputChange,
    handleCheckboxChange
  }
}
