import { useEffect, useState } from 'react'
import { getCategoriaByTemp, getCategoriaByTempByNac } from '../api/categorias'
import { useArticuloStore } from '../store/useArticuloStore'
import { useModalStore } from '../store/useModalStore'
import { useLocation } from 'react-router'
import { obtenerCostoTemporada } from '../api/costos-jugador'
import { obtenerCostoTemporada as obtCostTempPorri } from '../api/costos-porrista'

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
  const [categoriasCache, setCategoriasCache] = useState({})

  const [categoriaOptionsFilter, setCategoriaOptionsFilter] = useState([])
  const [categoriasCacheFilter, setCategoriasCacheFilter] = useState({})

  const { pathname } = useLocation()

  useEffect(() => {
    const fetchCategorias = async () => {
      const temporadaId = formData.temporadaId
      if (edit && temporadaId) {
        if (categoriasCache[temporadaId]) {
          setCategoriaOptions(categoriasCache[temporadaId])
          return
        }

        const categorias = await getCategoriaByTemp(temporadaId)
        categorias.unshift({ value: '', label: 'Selecciona una opción' })
        setCategoriasCache((prev) => ({ ...prev, [temporadaId]: categorias }))
        setCategoriaOptions(categorias)
      }
    }

    fetchCategorias()
  }, [edit, formData.temporadaId])

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
      if (categoriasCache[value]) {
        setCategoriaOptions(categoriasCache[value])
      } else {
        const categorias = await getCategoriaByTemp(value)
        categorias.unshift({ value: '', label: 'Selecciona una opción' })
        setCategoriasCache((prev) => ({ ...prev, [value]: categorias }))
        setCategoriaOptions(categorias)
      }
    }

    if (name === 'temporadaIdFilter') {
      if (categoriasCacheFilter[value]) {
        setCategoriaOptionsFilter(categoriasCacheFilter[value])
      } else {
        const categorias = await getCategoriaByTemp(value)
        categorias.unshift({ value: '', label: 'Selecciona una opción' })
        setCategoriasCacheFilter((prev) => ({ ...prev, [value]: categorias }))
        setCategoriaOptionsFilter(categorias)
      }
    }

    if (name === 'jugador' && pathname === '/pagos-jugadores') {
      setFormData('temporadaId', value.temporada)
      setFormData('categoria', value.categoria)

      const costosTemporada = await obtenerCostoTemporada(value.temporada)

      const costoInscripcion =
        parseFloat(costosTemporada[0]?.inscripcion) || 500
      const costoCoaching = parseFloat(costosTemporada[0]?.coaching) || 500
      const costoTunel = parseFloat(costosTemporada[0]?.tunel) || 500
      const costoBotiquin = parseFloat(costosTemporada[0]?.botiquin) || 500

      const montoTotal =
        costoInscripcion + costoCoaching + costoTunel + costoBotiquin

      setFormData('pagos.0.submonto', costoInscripcion)
      setFormData('pagos.0.monto', costoInscripcion)
      setFormData('pagos.1.monto', costoCoaching)
      setFormData('pagos.2.monto', costoTunel)
      setFormData('pagos.3.monto', costoBotiquin)
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
      setFormData('pagos.1.monto', costoCoaching)
      setFormData('monto_total_pendiente', montoTotal)
      setFormData('monto_total', montoTotal)
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

      // Obtener montos de los otros pagos
      const montoCoach = parseFloat(formData.pagos[1]?.monto) || 0
      const montoTunel = parseFloat(formData.pagos[2]?.monto) || 0
      const montoBoti = parseFloat(formData.pagos[3]?.monto) || 0

      // Calcular monto total
      const montoTotal = montoActualizado + montoCoach + montoTunel + montoBoti
      setNestedFormData('monto_total', montoTotal)

      // Calcular pagado y pendiente
      let totalPagado = 0
      let totalPendiente = 0

      formData.pagos.forEach((pago, index) => {
        const monto =
          index === 0 ? montoActualizado : parseFloat(pago.monto) || 0

        if (pago.estatus === 'pagado') {
          totalPagado += monto
        } else if (pago.estatus === 'pendiente') {
          totalPendiente += monto
        }
      })

      setNestedFormData('monto_total_pagado', totalPagado)
      setNestedFormData('monto_total_pendiente', totalPendiente)
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
          totalPendiente += monto
        }
      })

      setNestedFormData('monto_total', montoTotal)
      setNestedFormData('monto_total_pagado', totalPagado)
      setNestedFormData('monto_total_pendiente', totalPendiente)
    } else if (name.startsWith('pagos.') && name.endsWith('.monto')) {
      setNestedFormData(name, value)

      const updatedPagos = [...formData.pagos].map((pago, index) => {
        if (`pagos.${index}.monto` === name) {
          return { ...pago, monto: parseFloat(value) || 0 }
        }
        return { ...pago, monto: parseFloat(pago.monto) || 0 }
      })

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
    handleInputChange,
    handleFileChange,
    handleNestedInputChange,
    handleCheckboxChange
  }
}
