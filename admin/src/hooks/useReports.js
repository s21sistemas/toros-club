import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import { collection, getDocs, query, where } from 'firebase/firestore'
import dayjs from 'dayjs'
import { db } from '../api/db/firebaseConfig'
import { useBankStore } from '../store/useBankStore'
import { useState } from 'react'
import { useTemporadasStore } from '../store/useTemporadasStore'
import { getCategoriaByTemp } from '../api/categorias'
import { useProveedorStore } from '../store/useProveedorStore'
import { getCoordinadora } from '../api/users'
import { getUserByUID } from '../api/players'

export const useReports = () => {
  const getDataBanks = useBankStore((state) => state.getDataBanks)
  const getDataProveedor = useProveedorStore((state) => state.getDataProveedor)
  const getDataTemporadas = useTemporadasStore(
    (state) => state.getDataTemporadas
  )
  const [formReport, setFormReport] = useState({})
  const [categoriaOptions, setCategoriaOptions] = useState([])

  const handleInputChange = async (e, actionMeta) => {
    let name, value

    if (e.target) {
      ;({ name, value } = e.target)
    } else {
      name = actionMeta.name
      value = e || []
    }

    setFormReport((prevState) => ({
      ...prevState,
      [name]: value
    }))

    if (name === 'temporadaId') {
      if (value.value === 'todas') return

      const categorias = await getCategoriaByTemp(value)
      categorias.unshift({ value: 'todas', label: 'TODAS LAS CATEGORÍAS' })
      categorias.unshift({ value: '', label: 'Selecciona una opción' })
      setCategoriaOptions(categorias)
    }
  }

  const getFechaRegistro = (fecha_registro) => {
    return fecha_registro
      ? dayjs.unix(fecha_registro.seconds).format('DD/MM/YYYY')
      : 'Fecha no disponible'
  }

  const getCategoria = (cate) => {
    let categoria = cate

    if (
      categoria &&
      typeof categoria === 'object' &&
      !Array.isArray(categoria)
    ) {
      categoria = `${categoria.codigo || 'Sin código'} - ${
        categoria.tipo || 'Sin tipo'
      }`
    } else {
      categoria = categoria?.toString() || 'Sin asignar categoría'
    }

    return categoria
  }

  const exportToExcel = (data, columns, sheetName, fileName) => {
    if (!data || data.length === 0) {
      toast.warning('No hay datos para exportar.')
      return
    }

    // Definir encabezados de la tabla
    const headers = [columns]

    // Crear hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Agregar los encabezados
    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: 'A1' })

    // 📌 Ajustar el ancho de las columnas al tamaño del texto
    worksheet['!cols'] = columns.map((col) => ({ wch: col.length + 5 })) // Ajusta el ancho sumando 5 caracteres extra

    // Crear libro de Excel y añadir la hoja
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })

    // Guardar el archivo
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    })
    saveAs(dataBlob, fileName)
  }

  const obtenerAlmacen = async () => {
    try {
      let almacenRef = collection(db, 'almacen')
      const snapshot = await getDocs(almacenRef)
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener data:', error)
      return []
    }
  }

  const obtenerJugadores = async (filtro = null, valor = null) => {
    try {
      let jugadoresRef = collection(db, 'jugadores')
      let consulta = filtro
        ? query(jugadoresRef, where(filtro, '==', valor))
        : jugadoresRef
      const snapshot = await getDocs(consulta)
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener jugadores:', error)
      return []
    }
  }

  const obtenerPagosJugadores = async () => {
    try {
      const pagosJugadoresRef = collection(db, 'pagos_jugadores')
      const snapshot = await getDocs(pagosJugadoresRef)

      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener pagos de inscripción pendientes:', error)
      return []
    }
  }

  const obtenerPagosCoachingJugadores = async () => {
    try {
      const pagosJugadoresRef = collection(db, 'pagos_jugadores')
      const snapshot = await getDocs(pagosJugadoresRef)

      const jugadoresConPendiente = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((jugador) =>
          jugador.pagos?.some(
            (pago) => pago.estatus === 'pendiente' && pago.tipo === 'Coaching'
          )
        )

      return jugadoresConPendiente
    } catch (error) {
      console.error('Error al obtener pagos de inscripción pendientes:', error)
      return []
    }
  }

  const obtenerEquipamientoPrestado = async () => {
    try {
      let equipamientoRef = collection(db, 'equipamiento')
      const snapshot = await getDocs(equipamientoRef)
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data()

        const jugador = docData?.jugadorId?.label || 'Sin asignar'
        const equipo_prestado = Object.entries(docData)
          .filter(([key, value]) => value === true && key !== 'devuelto')
          .map(([key]) => key.split('_').join(' de '))
          .join(', ')

        return {
          id: doc.id,
          ...doc.data(),
          equipo_prestado,
          jugador
        }
      })

      return data
    } catch (error) {
      console.error('Error al obtener pagos de:', error)
      return []
    }
  }

  const obtenerGastos = async (info) => {
    try {
      let gastosRef = collection(db, 'gastos')

      const fechaInicio = dayjs(info.fecha_inicio).toDate()
      const fechaFin = dayjs(info.fecha_fin).toDate()

      let filtros = [
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin)
      ]

      if (info.metodo_pago !== 'todos') {
        filtros.push(where('metodo_pago', '==', info.metodo_pago))
      }

      if (info.banco !== 'todos') {
        filtros.push(where('bancoId.value', '==', info.banco))
      }

      const consulta = query(gastosRef, ...filtros)
      const snapshot = await getDocs(consulta)
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener datos:', error)
      return []
    }
  }

  const obtenerCompras = async (info) => {
    try {
      let comprasRef = collection(db, 'compras')

      const fechaInicio = dayjs(info.fecha_inicio).toDate()
      const fechaFin = dayjs(info.fecha_fin).toDate()

      let filtros = [
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin)
      ]

      if (info.metodo_pago !== 'todos') {
        filtros.push(where('metodo_pago', '==', info.metodo_pago))
      }

      if (info.banco !== 'todos') {
        filtros.push(where('bancoId.value', '==', info.banco))
      }

      if (info.proveedor !== 'todos') {
        filtros.push(where('proveedorId.value', '==', info.proveedor))
      }

      const consulta = query(comprasRef, ...filtros)
      const snapshot = await getDocs(consulta)
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener datos:', error)
      return []
    }
  }

  const obtenerOrdenes = async (info) => {
    try {
      let ordenesRef = collection(db, 'ordenes_compra')

      const fechaInicio = dayjs(info.fecha_inicio).toDate()
      const fechaFin = dayjs(info.fecha_fin).toDate()

      let filtros = [
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin)
      ]

      if (info.estatus !== 'todos') {
        filtros.push(where('estatus', '==', info.estatus))
      }

      if (info.banco !== 'todos') {
        filtros.push(where('bancoId.value', '==', info.banco))
      }

      if (info.proveedor !== 'todos') {
        filtros.push(where('proveedorId.value', '==', info.proveedor))
      }

      const consulta = query(ordenesRef, ...filtros)
      const snapshot = await getDocs(consulta)
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener datos:', error)
      return []
    }
  }

  const obtenerCuentasPagar = async (info) => {
    try {
      let comprasRef = collection(db, 'ordenes_compra')

      const fechaInicio = dayjs(info.fecha_inicio).toDate()
      const fechaFin = dayjs(info.fecha_fin).toDate()

      let filtros = [
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin)
      ]

      filtros.push(where('estatus', '==', 'pendiente'))

      if (info.banco !== 'todos') {
        filtros.push(where('bancoId.value', '==', info.banco))
      }

      if (info.proveedor !== 'todos') {
        filtros.push(where('proveedorId.value', '==', info.proveedor))
      }

      const consulta = query(comprasRef, ...filtros)
      const snapshot = await getDocs(consulta)
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener datos:', error)
      return []
    }
  }

  const obtenerJugadoresTempCat = async (filtro = false, info) => {
    try {
      let jugadoresRef = collection(db, 'jugadores')
      let consulta

      if (!filtro) {
        consulta = jugadoresRef
      } else if (info.categoria === 'todas') {
        consulta = query(
          jugadoresRef,
          where('temporadaId', '==', info.temporadaId)
        )
      } else if (info.categoria !== 'todas') {
        consulta = query(
          jugadoresRef,
          where('temporadaId', '==', info.temporadaId),
          where('categoria', '==', info.categoria)
        )
      } else {
        consulta = jugadoresRef
      }

      const snapshot = await getDocs(consulta)
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener jugadores:', error)
      return []
    }
  }

  const obtenerDatosPorColeccionBanco = async (coleccion, info) => {
    const ref = collection(db, coleccion)

    const fechaInicio = dayjs(info.fecha_inicio).toDate()
    const fechaFin = dayjs(info.fecha_fin).toDate()

    let filtros = [
      where('fecha', '>=', fechaInicio),
      where('fecha', '<=', fechaFin)
    ]

    if (info.banco !== 'todos') {
      filtros.push(where('bancoId.value', '==', info.banco))
    }

    const consulta = query(ref, ...filtros)
    const snapshot = await getDocs(consulta)

    return snapshot.docs.map((doc) => doc.data())
  }

  const obtenerHitorialPagos = async (info) => {
    try {
      let historialRef = collection(db, 'historial')

      const fechaInicio = dayjs(info.fecha_inicio).toDate()
      const fechaFin = dayjs(info.fecha_fin).toDate()

      let filtros = [
        where('fecha_recibido_filter', '>=', fechaInicio),
        where('fecha_recibido_filter', '<=', fechaFin)
      ]

      if (info.metodo_pago !== 'todos') {
        filtros.push(where('metodo_pago', '==', info.metodo_pago))
      }

      if (info.coordinadora.value !== 'todas') {
        filtros.push(where('coordinadora', '==', info.coordinadora.label))
      }

      const consulta = query(historialRef, ...filtros)
      const snapshot = await getDocs(consulta)
      return snapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error('Error al obtener datos:', error)
      return []
    }
  }

  const generarReporteAlmacen = async () => {
    const almacen = await obtenerAlmacen()

    const data = almacen.map((al) => ({
      producto: al.articuloId.label,
      precio: `$${parseFloat(al.precio_articulo)}`,
      stock: al.stock,
      tipo: al.tipo,
      concepto: al.concepto,
      fecha: al.fecha
    }))

    exportToExcel(
      data,
      [
        'Nombre del artículo',
        'Precio del artículo',
        'Stock',
        'Tipo',
        'Concepto',
        'Fecha de registro'
      ],
      'Reporte por almacen',
      `Reporte_almacen_${dayjs().format('DD-MM-YYYY')}.xlsx`
    )
  }

  const generarReporteTransferencia = async () => {
    const jugadores = await obtenerJugadores(
      'tipo_inscripcion',
      'transferencia'
    )
    const data = jugadores.map((j) => {
      const fechaRegistro = getFechaRegistro(j.fecha_registro)
      const categoria = getCategoria(j.categoria)

      return {
        nombre: `${j.nombre} ${j.apellido_p} ${j.apellido_m}`,
        curp: j.curp.toUpperCase(),
        fecha_nacimiento: dayjs(j.fecha_nacimiento).format('DD/MM/YYYY'),
        peso: `${j.peso} kg.`,
        categoria: categoria,
        numero_mfl: j.numero_mfl,
        club_anterior: j.transferencia?.club_anterior || 'N/A',
        temporadas_jugadas: j.transferencia?.temporadas_jugadas || 'N/A',
        motivo_transferencia: j.transferencia?.motivo_transferencia || 'N/A',
        fecha_registro: fechaRegistro
      }
    })

    exportToExcel(
      data,
      [
        'Nombre',
        'CURP',
        'Fecha de nacimiento',
        'Peso',
        'Categoría',
        'Número MFL',
        'Club anterior',
        'Temporadas jugadas',
        'Motivo de transferencia',
        'Fecha de registro'
      ],
      'Reporte por transferencias',
      `Reporte_jugadores_transferencias_${dayjs().format('DD-MM-YYYY')}.xlsx`
    )
  }

  const generarReporteNovatos = async () => {
    const jugadores = await obtenerJugadores('tipo_inscripcion', 'novato')
    const data = jugadores.map((j) => {
      const fechaRegistro = getFechaRegistro(j.fecha_registro)
      const categoria = getCategoria(j.categoria)

      return {
        nombre: `${j.nombre} ${j.apellido_p} ${j.apellido_m}`,
        curp: j.curp.toUpperCase(),
        fecha_nacimiento: dayjs(j.fecha_nacimiento).format('DD/MM/YYYY'),
        peso: `${j.peso} kg.`,
        categoria: categoria,
        numero_mfl: j.numero_mfl,
        fecha_registro: fechaRegistro
      }
    })

    exportToExcel(
      data,
      [
        'Nombre',
        'CURP',
        'Fecha de nacimiento',
        'Peso',
        'Categoría',
        'Número MFL',
        'Fecha de registro'
      ],
      'Reporte Novatos',
      `Reporte_Novatos_${dayjs().format('DD-MM-YYYY')}.xlsx`
    )
  }

  const generarReportePagos = async () => {
    const pagosData = await obtenerPagosJugadores()
    const data = pagosData.map((pago) => {
      const pagos = pago.pagos || []

      const montoIns = parseFloat(
        pagos.find((p) => p.tipo === 'Inscripción')?.monto
      )
      const totalAbonadoIns = parseFloat(
        pagos.find((p) => p.tipo === 'Inscripción')?.total_abonado
      )
      const totalRestanteIns = montoIns - totalAbonadoIns

      const montoCoach = parseFloat(
        pagos.find((p) => p.tipo === 'Coaching')?.monto
      )
      const totalAbonadoCoach = parseFloat(
        pagos.find((p) => p.tipo === 'Coaching')?.total_abonado
      )
      const totalRestanteCoach = montoCoach - totalAbonadoCoach

      const montoTunel = parseFloat(
        pagos.find((p) => p.tipo === 'Túnel')?.monto
      )
      const totalAbonadoTunel = parseFloat(
        pagos.find((p) => p.tipo === 'Túnel')?.total_abonado
      )
      const totalRestanteTunel = montoTunel - totalAbonadoTunel

      const montoBotiquin = parseFloat(
        pagos.find((p) => p.tipo === 'Botiquín')?.monto
      )
      const totalAbonadoBoti = parseFloat(
        pagos.find((p) => p.tipo === 'Botiquín')?.total_abonado
      )
      const totalRestanteBoti = montoBotiquin - totalAbonadoBoti

      return {
        temporada: pago.temporadaId.label,
        categoria: pago.categoria,
        nombre: pago.nombre,

        inscripcion: pagos.find((p) => p.tipo === 'Inscripción')?.estatus,
        monto_ins: `$${montoIns}`,
        total_abonado_ins: `$${totalAbonadoIns}`,
        total_restnate_ins: `$${totalRestanteIns}`,

        coacheo: pagos.find((p) => p.tipo === 'Coaching')?.estatus,
        monto_coach: `$${montoCoach}`,
        total_abonado_coach: `$${totalAbonadoCoach}`,
        total_restnate_coach: `$${totalRestanteCoach}`,

        tunel: pagos.find((p) => p.tipo === 'Túnel')?.estatus,
        monto_tunel: `$${montoTunel}`,
        total_abonado_tunel: `$${totalAbonadoTunel}`,
        total_restnate_tunel: `$${totalRestanteTunel}`,

        botiquin: pagos.find((p) => p.tipo === 'Botiquín')?.estatus,
        monto_botiquin: `$${montoBotiquin}`,
        total_abonado_boti: `$${totalAbonadoBoti}`,
        total_restnate_boti: `$${totalRestanteBoti}`,

        monto_total_pagado: `$${pago.monto_total_pagado}`,
        monto_total_pendiente: `$${pago.monto_total_pendiente}`,
        monto_total: `$${pago.monto_total}`,
        fecha_registro: dayjs(pago.fecha_registro).format('DD/MM/YYYY')
      }
    })

    exportToExcel(
      data,
      [
        'Temporada',
        'Categoria',
        'Jugador',
        'Inscripción',
        'Monto de inscripción',
        'Total abonado de inscripción',
        'Total restante de inscripción',
        'Coaching',
        'Monto de coaching',
        'Total abonado de coaching',
        'Total restante de coaching',
        'Aportación',
        'Monto de aportación',
        'Total abonado de aportación',
        'Total restante de aportación',
        'Botiquín',
        'Monto de botiquín',
        'Total abonado de botiquín',
        'Total restante de botiquín',
        'Total pagado',
        'Total pendiente restante',
        'Monto total a pagar',
        'Fecha de registro'
      ],
      'Reporte de pagos',
      `Reporte_pagos_${dayjs().format('DD-MM-YYYY')}.xlsx`
    )
  }

  const generarReportePagosCoaching = async () => {
    const pagosData = await obtenerPagosCoachingJugadores()
    const data = pagosData.map((pago) => {
      const pagos = pago.pagos || []
      const fecha_limite = pago.fecha_registro
        ? dayjs(pago.fecha_registro).format('DD/MM/YYYY')
        : 'Fecha no asignada'

      const montoCoach = parseFloat(
        pagos.find((p) => p.tipo === 'Coaching')?.monto
      )
      const totalAbonadoCoach = parseFloat(
        pagos.find((p) => p.tipo === 'Coaching')?.total_abonado
      )
      const totalRestanteCoach = montoCoach - totalAbonadoCoach

      return {
        temporada: pago.temporadaId.label,
        categoria: pago.categoria,
        nombre: pago.nombre,

        coacheo: pagos.find((p) => p.tipo === 'Coaching')?.estatus,
        monto_coach: `$${montoCoach}`,
        total_abonado_coach: `$${totalAbonadoCoach}`,
        total_restnate_coach: `$${totalRestanteCoach}`,

        fecha_limite: fecha_limite,
        fecha_registro: dayjs(pago.fecha_registro).format('DD/MM/YYYY')
      }
    })

    exportToExcel(
      data,
      [
        'Temporada',
        'Categoria',
        'Jugador',
        'Coaching',
        'Monto de coaching',
        'Total abonado de coaching',
        'Total restante de coaching',
        'Fecha límite',
        'Fecha de registro'
      ],
      'Reporte de pagos de coacheo',
      `Reporte_pagos_coaching_${dayjs().format('DD-MM-YYYY')}.xlsx`
    )
  }

  const generarReporteEquipamiento = async () => {
    const equipamiento = await obtenerEquipamientoPrestado()
    const data = equipamiento.map((equipo) => ({
      jugador: equipo.jugador,
      equipo_prestado: equipo.equipo_prestado,
      fecha_asignacion: dayjs(equipo.fecha_asignacion).format('DD/MM/YYYY'),
      devuelto: equipo.devuelto
    }))

    exportToExcel(
      data,
      ['Jugador', 'Equipamiento prestado', 'Fecha de prestamo', '¿Devuelto?'],
      'Reporte de equipo prestado',
      `Reporte_equipamiento_prestado_${dayjs().format('DD-MM-YYYY')}.xlsx`
    )
  }

  const generarReporteGastos = async (data) => {
    if (data.bancoId) {
      data.banco = data.bancoId.value
      delete data.bancoId
    }

    const gastos = await obtenerGastos(data)

    if (gastos.length === 0)
      toast.warning('No se encontraron registros con este filtro')
    else {
      const dataExport = gastos.map((gasto) => ({
        banco: gasto.bancoId.label,
        concepto: gasto.concepto,
        metodo_pago: gasto.metodo_pago,
        total: gasto.total,
        fecha: dayjs(gasto.fecha.toDate()).format('DD/MM/YYYY')
      }))

      exportToExcel(
        dataExport,
        [
          'Banco',
          'Concepto',
          'Método de pago',
          'Total (MXN)',
          'Fecha del gasto'
        ],
        'Reporte de gastos',
        `Reporte_gastos_${dayjs().format('DD-MM-YYYY')}.xlsx`
      )
    }
  }

  const generarReporteCompras = async (data) => {
    if (data.bancoId) {
      data.banco = data.bancoId.value
      delete data.bancoId
    }

    if (data.proveedorId) {
      data.proveedor = data.proveedorId.value
      delete data.proveedorId
    }

    const compras = await obtenerCompras(data)

    if (compras.length === 0)
      toast.warning('No se encontraron registros con este filtro')
    else {
      const dataExport = compras.map((gasto) => ({
        proveedor: gasto.proveedorId.label,
        articulo: gasto.articuloId.label,
        banco: gasto.bancoId.label,
        concepto: gasto.concepto,
        metodo_pago: gasto.metodo_pago,
        total: gasto.total,
        fecha: dayjs(gasto.fecha.toDate()).format('DD/MM/YYYY')
      }))

      exportToExcel(
        dataExport,
        [
          'Proveedor',
          'Artículo',
          'Banco',
          'Concepto',
          'Método de pago',
          'Total (MXN)',
          'Fecha de la compra'
        ],
        'Reporte de compras',
        `Reporte_compras_${dayjs().format('DD-MM-YYYY')}.xlsx`
      )
    }
  }

  const generarReporteOrdenes = async (data) => {
    if (data.bancoId) {
      data.banco = data.bancoId.value
      delete data.bancoId
    }

    if (data.proveedorId) {
      data.proveedor = data.proveedorId.value
      delete data.proveedorId
    }

    const compras = await obtenerOrdenes(data)

    if (compras.length === 0)
      toast.warning('No se encontraron registros con este filtro')
    else {
      const dataExport = compras.map((gasto) => ({
        proveedor: gasto.proveedorId.label,
        articulo: gasto.articuloId.label,
        banco: gasto.bancoId.label,
        cantidad: gasto.cantidad_articulos,
        estatus: gasto.estatus,
        total: gasto.total,
        fecha: dayjs(gasto.fecha.toDate()).format('DD/MM/YYYY')
      }))

      exportToExcel(
        dataExport,
        [
          'Proveedor',
          'Artículo',
          'Banco',
          'Cantidad',
          'Estatus',
          'Total (MXN)',
          'Fecha de la orden'
        ],
        'Reporte de ordenes',
        `Reporte_ordenes_compras_${dayjs().format('DD-MM-YYYY')}.xlsx`
      )
    }
  }

  const generarReporteCuentasPagar = async (data) => {
    if (data.bancoId) {
      data.banco = data.bancoId.value
      delete data.bancoId
    }

    if (data.proveedorId) {
      data.proveedor = data.proveedorId.value
      delete data.proveedorId
    }

    const compras = await obtenerCuentasPagar(data)

    if (compras.length === 0)
      toast.warning('No se encontraron registros con este filtro')
    else {
      const dataExport = compras.map((gasto) => ({
        proveedor: gasto.proveedorId.label,
        articulo: gasto.articuloId.label,
        banco: gasto.bancoId.label,
        cantidad: gasto.cantidad_articulos,
        estatus: gasto.estatus,
        total: gasto.total,
        fecha: dayjs(gasto.fecha.toDate()).format('DD/MM/YYYY')
      }))

      exportToExcel(
        dataExport,
        [
          'Proveedor',
          'Artículo',
          'Banco',
          'Cantidad',
          'Estatus',
          'Total (MXN)',
          'Fecha de la orden'
        ],
        'Reporte de cuentas a pagar',
        `Reporte_cuentas_pagar_${dayjs().format('DD-MM-YYYY')}.xlsx`
      )
    }
  }

  const generarReporteJugadoresTempCat = async (data) => {
    const filter = data.temporadaId.value === 'todas' ? false : true
    const jugadores = await obtenerJugadoresTempCat(filter, data)

    if (jugadores.length === 0)
      toast.warning('No se encontraron registros con este filtro')
    else {
      const data = await Promise.all(
        jugadores.map(async (j) => {
          const fechaRegistro = getFechaRegistro(j.fecha_registro)
          const categoria = getCategoria(j.categoria)
          const tutor = await getUserByUID(j.uid)

          return {
            temporada: j.temporadaId?.label || 'Sin temporada asignada',
            nombre: `${j.nombre} ${j.apellido_p} ${j.apellido_m}`,
            curp: j?.curp?.toUpperCase() || 'Sin CURP',
            fecha_nacimiento: dayjs(j.fecha_nacimiento).format('DD/MM/YYYY'),
            peso: `${j.peso} kg.`,
            categoria: categoria,
            numero_mfl: j.numero_mfl,
            fecha_registro: fechaRegistro,
            tutor: tutor.nombre_completo,
            celular_tutor: tutor.celular,
            correo_tutor: tutor.correo
          }
        })
      )

      exportToExcel(
        data,
        [
          'Temporada',
          'Nombre',
          'CURP',
          'Fecha de nacimiento',
          'Peso',
          'Categoría',
          'Número MFL',
          'Fecha de registro',
          'Tutor',
          'Celular del tutor',
          'Correo del tutor'
        ],
        'Reporte de categorías',
        `Reporte_categorias_${dayjs().format('DD-MM-YYYY')}.xlsx`
      )
    }
  }

  // BANCOS - "GASTOS", "COMPRAS", "ORDENES DE COMPRA"
  const generarReporteGeneralBancos = async (data) => {
    if (data.bancoId) {
      data.banco = data.bancoId.value
      delete data.bancoId
    }

    const colecciones = ['gastos', 'compras']

    let resumenPorBanco = {}

    for (const coleccion of colecciones) {
      const registros = await obtenerDatosPorColeccionBanco(coleccion, data)

      registros.forEach((item) => {
        const banco = item.bancoId?.label || 'Sin banco'
        const monto = parseFloat(item.total) || 0

        if (!resumenPorBanco[banco]) {
          resumenPorBanco[banco] = {
            total: 0
          }
        }

        resumenPorBanco[banco].total += monto
      })
    }

    const dataExport = Object.entries(resumenPorBanco).map(
      ([banco, { total }]) => ({
        banco,
        total: `$${total.toFixed(2)}`,
        fecha: dayjs().format('DD/MM/YYYY')
      })
    )

    exportToExcel(
      dataExport,
      ['Banco', 'Monto gastado', 'Fecha de generación del reporte'],
      'Reporte de egresos',
      `Reporte_egresos_${dayjs().format('DD-MM-YYYY')}.xlsx`
    )
  }

  const loadOptionsBancos = async () => {
    try {
      const data = await getDataBanks()
      const info = data.map((banco) => ({
        value: banco.id,
        label: banco.nombre
      }))

      info.unshift({ label: 'TODOS', value: 'todos' })

      return info
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  const loadOptionsProveedor = async () => {
    try {
      const data = await getDataProveedor()
      const info = data.map((banco) => ({
        value: banco.id,
        label: banco.nombre
      }))

      info.unshift({ label: 'TODOS', value: 'todos' })

      return info
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  const loadOptionsTemporadas = async () => {
    try {
      const data = await getDataTemporadas()
      const info = data.map((temp) => ({
        value: temp.id,
        label: temp.temporada
      }))
      info.unshift({ value: 'todas', label: 'Todas' })
      return info
    } catch (error) {
      console.error('Error loading temporadas:', error)
      return []
    }
  }

  const loadOptionsCoordinadora = async () => {
    try {
      const data = await getCoordinadora()
      const info = data.map((coor) => ({
        value: coor.id,
        label: coor.nombre_completo
      }))

      info.unshift({ label: 'TODAS', value: 'todas' })

      return info
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  const generarReporteHistorialPagos = async (data) => {
    const historialPagos = await obtenerHitorialPagos(data)

    if (historialPagos.length === 0)
      toast.warning('No se encontraron registros con este filtro')
    else {
      const dataExport = historialPagos.map((historial) => ({
        coordinadora: historial.coordinadora,
        elemento: historial.nombre,
        concepto: historial.concepto,
        metodo_pago: historial.metodo_pago,
        monto: parseFloat(historial.monto),
        fecha_caja: historial.fecha_pago,
        fecha_recibido: historial.fecha_recibido
      }))

      const montoTotal = dataExport.reduce(
        (total, item) => total + item.monto,
        0
      )

      dataExport.push({
        coordinadora: '',
        elemento: '',
        concepto: '',
        metodo_pago: '',
        monto: '',
        fecha_caja: '',
        fecha_recibido: ''
      })

      dataExport.push({
        coordinadora: '',
        elemento: '',
        concepto: '',
        metodo_pago: 'Total',
        monto: montoTotal,
        fecha_caja: '',
        fecha_recibido: ''
      })

      exportToExcel(
        dataExport,
        [
          'Coordinadora que recibió',
          'Jugador/Porrista',
          'Concepto',
          'Método de pago',
          'Monto (MXN)',
          'Fecha en que recibió caja',
          'Fecha en qie entregó caja'
        ],
        'Reporte del historial de pagos',
        `Reporte_historial_pagos_${dayjs().format('DD-MM-YYYY')}.xlsx`
      )
    }
  }

  return {
    generarReporteAlmacen,
    generarReporteTransferencia,
    generarReporteNovatos,
    generarReportePagos,
    generarReportePagosCoaching,
    generarReporteEquipamiento,
    generarReporteGastos,
    generarReporteCompras,
    generarReporteOrdenes,
    generarReporteCuentasPagar,
    generarReporteJugadoresTempCat,
    generarReporteGeneralBancos,
    generarReporteHistorialPagos,
    loadOptionsBancos,
    loadOptionsProveedor,
    loadOptionsTemporadas,
    loadOptionsCoordinadora,
    handleInputChange,
    categoriaOptions,
    formReport
  }
}
