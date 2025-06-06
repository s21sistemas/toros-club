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

        const montoCoach = parseFloat(data?.coaching || 0)
        const montoTunel = parseFloat(data?.tunel || 0)
        const montoBoti = parseFloat(data?.botiquin || 0)

        setFormData('pagos.0.submonto', parseFloat(subMontoIns))
        setFormData('pagos.1.monto', montoCoach)
        setFormData('pagos.2.monto', montoTunel)
        setFormData('pagos.3.monto', montoBoti)

        // Descuentos
        const submonto = parseFloat(formData.pagos[0]?.submonto || 0)
        const descuento = parseFloat(formData.pagos[0]?.descuento || 0)
        const beca = parseFloat(formData.pagos[0]?.beca || 0)

        // Calcular monto con descuento y beca
        const descuentoAplicado = submonto * (descuento / 100)
        const becaAplicada = submonto * (beca / 100)
        const montoActualizado = submonto - descuentoAplicado - becaAplicada
        setFormData('pagos.0.monto', montoActualizado || 0)

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
          const totalRestanteCoach = montoCoach - totalAbonoCoach
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

        // Total pendiente
        const fechaLimiteCoach = formData.pagos[1].fecha_limite
          ? formData.pagos[1].fecha_limite
          : dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        const validacionFecha = dayjs(fechaLimiteCoach).isBefore(dayjs(), 'day')
        const restanteCoach = formData.pagos[1].total_restante
        const coachRestante = parseFloat(validacionFecha ? restanteCoach : 0)

        const insRestante = parseFloat(formData.pagos[0].total_restante)
        const tunelRestante = parseFloat(formData.pagos[2].total_restante)
        const botiquinRestante = parseFloat(formData.pagos[3].total_restante)

        const totalPendiente =
          insRestante + coachRestante + tunelRestante + botiquinRestante

        // Total a pagar
        const montoTotal =
          parseFloat(montoActualizado) +
          parseFloat(montoCoach || 0) +
          parseFloat(montoTunel || 0) +
          parseFloat(montoBoti || 0)

        // Total pagado
        const totalPagado = montoTotal - totalPendiente

        setFormData('monto_total_pendiente', totalPendiente || '0')
        setFormData('monto_total_pagado', totalPagado || '0')
        setFormData('monto_total', montoTotal || '0')
      }

      preciosTemporadaCategoria()
    }
  }, [
    formData.cambio_inscripcion,
    formData.categoria,
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

        const montoIns = parseFloat(data?.inscripcion || 0)
        const montoCoach = parseFloat(data?.coaching || 0)

        setFormData('pagos.0.monto', montoIns)
        setFormData('pagos.1.monto', montoCoach)

        // Calculos de los restantes totales
        if (formData.pagos?.[0]?.estatus === 'pagado') {
          setNestedFormData('pagos.0.total_restante', '0')
        } else {
          const totalAbonoIns = parseFloat(
            formData.pagos?.[0]?.total_abonado || 0
          )
          const totalRestanteIns = montoIns - totalAbonoIns
          setFormData('pagos.0.total_restante', totalRestanteIns)
        }

        if (formData.pagos?.[1]?.estatus === 'pagado') {
          setNestedFormData('pagos.1.total_restante', '0')
        } else {
          const totalAbonoCoach = parseFloat(
            formData.pagos?.[1]?.total_abonado || 0
          )
          const totalRestanteCoach = montoCoach - totalAbonoCoach
          setFormData('pagos.1.total_restante', totalRestanteCoach)
        }

        // Total pendiente
        const insRestante = parseFloat(formData.pagos[0].total_restante)
        const coachRestante = parseFloat(formData.pagos[1].total_restante)

        const totalPendiente = insRestante + coachRestante

        // Total a pagar
        const montoTotal = parseFloat(montoIns) + parseFloat(montoCoach || 0)

        // Total pagado
        const totalPagado = montoTotal - totalPendiente

        setFormData('monto_total_pendiente', totalPendiente || '0')
        setFormData('monto_total_pagado', totalPagado || '0')
        setFormData('monto_total', montoTotal || '0')
      }

      preciosTemporadaCategoria()
    }
  }, [
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

  const handleAbonoChange = (name, value, index) => {
    const nuevaCantidad = parseFloat(value || 0)
    const totalRestante = parseFloat(
      formData?.pagos[index]?.total_restante || 0
    )
    const pendienteActual = parseFloat(formData.monto_total_pendiente || 0)
    const pagadoActual = parseFloat(formData.monto_total_pagado || 0)
    const cantidadAnterior = parseFloat(formData[name] || 0)

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
    setFormData('monto_total_pendiente', nuevoPendiente)
    setFormData('monto_total_pagado', nuevoPagado)
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

      const montoTotal =
        costoInscripcion + costoCoaching + costoTunel + costoBotiquin

      setFormData('pagos.0.submonto', costoInscripcion)
      setFormData('pagos.0.monto', costoInscripcion)
      setFormData('pagos.0.total_restante', costoInscripcion)
      setFormData('pagos.1.monto', costoCoaching)
      setFormData('pagos.1.total_restante', costoCoaching)
      setFormData('pagos.2.monto', costoTunel)
      setFormData('pagos.2.total_restante', costoTunel)
      setFormData('pagos.3.monto', costoBotiquin)
      setFormData('pagos.3.total_restante', costoBotiquin)
      setFormData('monto_total_pendiente', montoTotal)
      setFormData('monto_total', montoTotal)
    }

    if (name === 'porrista' && pathname === '/pagos-porristas') {
      setFormData('temporadaId', value.temporada)

      const costosTemporada = await obtCostTempPorri(value.temporada)

      const costoInscripcion =
        parseFloat(costosTemporada[0]?.inscripcion) || 500
      const costoCoaching = parseFloat(costosTemporada[0]?.coaching) || 500
      const montoTotal = costoInscripcion + costoCoaching

      setFormData('pagos.0.monto', costoInscripcion)
      setFormData('pagos.0.total_restante', costoInscripcion)
      setFormData('pagos.1.monto', costoCoaching)
      setFormData('pagos.1.total_restante', costoCoaching)
      setFormData('monto_total_pendiente', montoTotal)
      setFormData('monto_total', montoTotal)
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
      const montoCoach = parseFloat(formData.pagos[1]?.monto) || 0
      const montoTunel = parseFloat(formData.pagos[2]?.monto) || 0
      const montoBoti = parseFloat(formData.pagos[3]?.monto) || 0

      // Calcular monto total
      const montoTotal = montoActualizado + montoCoach + montoTunel + montoBoti
      setNestedFormData('monto_total', montoTotal)

      // Calcular pendiente
      const montoCoachPendiente =
        parseFloat(formData.pagos[1]?.total_restante) || 0
      const montoTunelPendiente =
        parseFloat(formData.pagos[2]?.total_restante) || 0
      const montoBotiPendiente =
        parseFloat(formData.pagos[3]?.total_restante) || 0

      // Calcular monto total
      const montoTotalPendiente =
        totalRestante +
        montoCoachPendiente +
        montoTunelPendiente +
        montoBotiPendiente
      setNestedFormData('monto_total_pendiente', montoTotalPendiente)

      // Calcular monto pagado
      const montoTotalPagado = montoTotal - montoTotalPendiente
      setNestedFormData('monto_total_pagado', montoTotalPagado)
    } else if (name.startsWith('pagos.') && name.endsWith('.estatus')) {
      // Actualizamos el campo editado
      setNestedFormData(name, value)

      // Obtener pagos actualizados
      const updatedPagos = [...formData.pagos].map((pago, index) => {
        if (`pagos.${index}.estatus` === name) {
          return { ...pago, estatus: value }
        }
        return pago
      })

      // Calcular montos
      let montoTotal = 0
      let totalPagado = 0
      let totalPendiente = 0

      updatedPagos.forEach((pago) => {
        const monto = parseFloat(pago.monto) || 0
        montoTotal += monto

        if (pago.estatus === 'pagado') {
          totalPagado += monto
        } else if (pago.estatus === 'pendiente') {
          const pendiente =
            parseFloat(pago.monto) - parseFloat(pago.total_abonado)
          totalPendiente += pendiente
          totalPagado += parseFloat(pago.total_abonado)
        }
      })

      setNestedFormData('monto_total', montoTotal)
      setNestedFormData('monto_total_pagado', totalPagado)
      setNestedFormData('monto_total_pendiente', totalPendiente)
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

      let montoTotal = 0
      let totalPagado = 0
      let totalPendiente = 0

      updatedPagos.forEach((pago) => {
        montoTotal += pago.monto

        if (pago.estatus === 'pagado') {
          totalPagado += pago.monto
        } else if (pago.estatus === 'pendiente') {
          totalPendiente += pago.monto
        }
      })

      setNestedFormData('monto_total', montoTotal)
      setNestedFormData('monto_total_pagado', totalPagado)
      setNestedFormData('monto_total_pendiente', totalPendiente)
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
      const pendienteActual = parseFloat(formData.monto_total_pendiente || 0)
      const pagadoActual = parseFloat(formData.monto_total_pagado || 0)

      const nuevoPendiente = pendienteActual + abono
      const nuevoPagado = pagadoActual - abono

      setFormData(abonoField, 0)
      setFormData('monto_total_pendiente', nuevoPendiente)
      setFormData('monto_total_pagado', nuevoPagado)
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
