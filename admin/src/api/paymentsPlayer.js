import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  where,
  query,
  getDoc
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import { createCaja } from './caja'
import { removePlayer } from './players'

const pagosCollection = collection(db, 'pagos_jugadores')

// Crear un pago
export const createPayment = async (data) => {
  try {
    const actuallyDate = dayjs()

    const newData = {
      ...data,
      fecha_registro: actuallyDate.format('YYYY-MM-DD')
    }

    const docRef = await addDoc(pagosCollection, newData)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar pago:', error)
  }
}

// Obtener registro
export const getPayments = async (callback) => {
  return onSnapshot(pagosCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const pago = doc.data()
      const pagos = pago.pagos || []
      const fecha_inscripcion = dayjs(doc.data().fecha_registro).format(
        'DD/MM/YYYY'
      )
      const fecha_inicial = dayjs(doc.data().fecha_registro).format(
        'YYYY-MM-DD'
      )

      const coachCancelado =
        pagos.find((p) => p.tipo === 'Coaching')?.cancelar_coach || false
      const tunelCancelado =
        pagos.find((p) => p.tipo === 'Túnel')?.cancelar_tunel || false
      const btqCancelado =
        pagos.find((p) => p.tipo === 'Botiquín')?.cancelar_botiquin || false

      let coacheo = 'pendiente'
      const actually = dayjs()
      const coachFechaLimite = pagos.find(
        (p) => p.tipo === 'Coaching'
      )?.fecha_limite

      if (coachFechaLimite) {
        const coachPago = dayjs(coachFechaLimite).isAfter(actually)
        coacheo = coachPago ? 'pagado' : 'pendiente'
      }

      let tunel = pagos.find((p) => p.tipo === 'Túnel')?.estatus || 'pendiente'
      let botiquin =
        pagos.find((p) => p.tipo === 'Botiquín')?.estatus || 'pendiente'

      if (coachCancelado) coacheo = 'cancelado'
      if (tunelCancelado) tunel = 'cancelado'
      if (btqCancelado) botiquin = 'cancelado'

      return {
        id: doc.id,
        jugador: { value: pago.jugadorId, label: pago.nombre },
        prorroga: pagos.find((p) => p.tipo === 'Inscripción')?.prorroga,
        fecha_limite: pagos.find((p) => p.tipo === 'Inscripción')?.fecha_limite,
        inscripcion: pagos.find((p) => p.tipo === 'Inscripción')?.estatus,
        tunel,
        botiquin,
        coacheo: coacheo,
        historial_total_pagado:
          pagos.find((p) => p.tipo === 'Coaching')?.historial_total_pagado || 0,
        fecha_inscripcion,
        fecha_inicial,
        ...doc.data()
      }
    })

    callback(data)
  })
}

// Obtener costos por temporada
export const getPagosJugadoresTempCat = async (temporadaId, categoria) => {
  try {
    const snapshot = await getDocs(
      query(
        pagosCollection,
        where('temporadaId', '==', temporadaId),
        where('categoria', '==', categoria)
      )
    )

    const data = snapshot.docs.map((doc) => {
      const pago = doc.data()
      const pagos = pago.pagos || []

      return {
        id: doc.id,
        jugador: { value: pago.jugadorId, label: pago.nombre },
        prorroga: pagos.find((p) => p.tipo === 'Inscripción')?.prorroga,
        fecha_limite: pagos.find((p) => p.tipo === 'Inscripción')?.fecha_limite,
        inscripcion: pagos.find((p) => p.tipo === 'Inscripción')?.estatus,
        tunel: pagos.find((p) => p.tipo === 'Túnel')?.estatus,
        botiquin: pagos.find((p) => p.tipo === 'Botiquín')?.estatus,
        coacheo: pagos.find((p) => p.tipo === 'Coaching')?.estatus,
        ...doc.data()
      }
    })

    return data
  } catch (error) {
    console.error('Error al obtener porristas:', error)
    return []
  }
}

export const getPaymentById = async (id) => {
  try {
    const docRef = doc(db, 'pagos_jugadores', id)
    const docSnap = await getDoc(docRef)

    const payment = docSnap.data()
    return {
      ...payment,
      id: docSnap.id
    }
  } catch (error) {
    console.error('Error al obtener el jugador:', error)
    return null
  }
}

export const getPaymentByJugadorId = async (id) => {
  try {
    const snapshot = await getDocs(
      query(pagosCollection, where('jugadorId', '==', id))
    )

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener el jugador:', error)
    return null
  }
}

// Función para limpiar los datos de cada pago (incluyendo todos los campos undefined)
const cleanPagoData = (pago) => {
  // Limpiar todos los campos dentro de cada pago
  for (const key in pago) {
    if (pago[key] === undefined) {
      pago[key] = null // Si el campo es undefined, lo convierte en null
    }
  }
  return pago
}

// Función de limpieza general para los datos
const cleanData = (data) => {
  // Limpiar los datos principales del pago
  const cleanedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined ? null : value // Convertir `undefined` a `null` en el objeto principal
    ])
  )

  // Limpiar específicamente los pagos dentro de los datos
  if (cleanedData.pagos) {
    cleanedData.pagos = cleanedData.pagos.map(cleanPagoData) // Limpiar cada pago en el array `pagos`
  }

  return cleanedData
}

// Actualizar un pago
export const updatePayment = async (id, data) => {
  try {
    let newData = { ...data }

    newData = cleanData(newData)

    // DATAS
    const inscripcion = data.pagos.find((p) => p.tipo === 'Inscripción')
    const tunel = data.pagos.find((p) => p.tipo === 'Túnel')
    const botiquin = data.pagos.find((p) => p.tipo === 'Botiquín')
    const coach = data.pagos.find((p) => p.tipo === 'Coaching')

    // Actualizar coaching
    const index = data.pagos.findIndex((p) => p.tipo === 'Coaching')
    if (index !== -1) {
      const coachingPayment = data.pagos[index] // Obtener el objeto original

      // Sumarle una semana a la fecha final para la fecha limite de pago
      const fecha = coachingPayment.fecha_pago
        ? coachingPayment.fecha_pago
        : coachingPayment.fecha_final
      const newFechaLimite = dayjs(fecha).add(1, 'week').format('YYYY-MM-DD')

      // Si el pago está en "pagado", actualizar su estado y fecha límite
      const fechaPago = coachingPayment.fecha_pago
        ? coachingPayment.fecha_pago
        : coachingPayment.fecha_final
      if (coachingPayment.estatus === 'pagado') {
        newData.pagos[index] = {
          ...coachingPayment,
          pago_coaching: [
            ...(coachingPayment.pago_coaching || []),
            {
              fecha_inicial: fechaPago,
              fecha_final: fechaPago ? fechaPago : coachingPayment.fecha_final,
              total_pagado: coachingPayment.monto
            }
          ],
          estatus: 'pendiente',
          fecha_limite: newFechaLimite,
          fecha_pago: fechaPago,
          fecha_inicial: fechaPago ? fechaPago : coachingPayment.fecha_final,
          fecha_final: null,
          historial_total_pagado:
            parseFloat(coachingPayment.monto || 0) +
            parseFloat(coachingPayment.historial_total_pagado || 0),
          historial_total_abonado:
            parseFloat(coachingPayment.total_abonado || 0) +
            parseFloat(coachingPayment.historial_total_abonado || 0),
          total_abonado: 0,
          descuento: 0
        }
      }
    }

    if (newData.cambiar_inscripcion) {
      newData.cambio_inscripcion = newData.cambiar_inscripcion
    }

    if (newData.cambiar_coach) {
      newData.cambio_coach = newData.cambiar_coach
    }

    // Abono de inscripción
    if (inscripcion.abono === 'SI') {
      if (!Array.isArray(inscripcion.abonos)) inscripcion.abonos = []

      inscripcion.abonos.push({
        cantidad: data.cantidad_abono_ins,
        fecha: data.fecha_abono_ins,
        metodo: data.metodo_pago_abono_ins
      })

      inscripcion.total_abonado =
        parseFloat(data.cantidad_abono_ins) +
        parseFloat(inscripcion.total_abonado || 0)

      inscripcion.abono = 'NO'

      if (
        parseFloat(inscripcion.total_abonado) === parseFloat(inscripcion.monto)
      ) {
        inscripcion.estatus = 'pagado'
        inscripcion.fecha_pago = data.fecha_abono_ins
        inscripcion.metodo_pago = data.metodo_pago_abono_ins
        inscripcion.total_restante = 0
      }

      // Abonos en caja
      const inscripcionPagoCaja = {
        jugadorId: data.jugadorId,
        nombre: data.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de inscripción (abono)',
        fecha_pago: data.fecha_abono_ins || hoy,
        total: data.cantidad_abono_ins || 0,
        metodo_pago: data.metodo_pago_abono_ins || null
      }
      await createCaja(inscripcionPagoCaja)
    }

    // Abono de tunel
    if (tunel.abono === 'SI') {
      if (!Array.isArray(tunel.abonos)) tunel.abonos = []

      tunel.abonos.push({
        cantidad: data.cantidad_abono_tunel,
        fecha: data.fecha_abono_tunel,
        metodo: data.metodo_pago_abono_tunel
      })

      tunel.total_abonado =
        parseFloat(data.cantidad_abono_tunel) +
        parseFloat(tunel.total_abonado || 0)

      tunel.abono = 'NO'

      if (parseFloat(tunel.total_abonado) === parseFloat(tunel.monto)) {
        tunel.estatus = 'pagado'
        tunel.fecha_pago = data.fecha_abono_tunel
        tunel.metodo_pago = data.metodo_pago_abono_tunel
        tunel.total_restante = 0
      }

      // Abonos en caja
      const tunelPagoCaja = {
        jugadorId: data.jugadorId,
        nombre: data.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de aportación (abono)',
        fecha_pago: data.fecha_abono_tunel || hoy,
        total: data.cantidad_abono_tunel || 0,
        metodo_pago: data.metodo_pago_abono_tunel || null
      }
      await createCaja(tunelPagoCaja)
    }

    // Abono de botiquin
    if (botiquin.abono === 'SI') {
      if (!Array.isArray(botiquin.abonos)) botiquin.abonos = []

      botiquin.abonos.push({
        cantidad: data.cantidad_abono_botiquin,
        fecha: data.fecha_abono_botiquin,
        metodo: data.metodo_pago_abono_botiquin
      })

      botiquin.total_abonado =
        parseFloat(data.cantidad_abono_botiquin) +
        parseFloat(botiquin.total_abonado || 0)

      botiquin.abono = 'NO'

      if (parseFloat(botiquin.total_abonado) === parseFloat(botiquin.monto)) {
        botiquin.estatus = 'pagado'
        botiquin.fecha_pago = data.fecha_abono_botiquin
        botiquin.metodo_pago = data.metodo_pago_abono_botiquin
        botiquin.total_restante = 0
      }

      // Abonos en caja
      const botiquinPagoCaja = {
        jugadorId: data.jugadorId,
        nombre: data.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de botiquin (abono)',
        fecha_pago: data.fecha_abono_botiquin || hoy,
        total: data.cantidad_abono_botiquin || 0,
        metodo_pago: data.metodo_pago_abono_botiquin || null
      }
      await createCaja(botiquinPagoCaja)
    }

    // Abono de coach
    if (coach.abono === 'SI') {
      if (!Array.isArray(coach.abonos)) coach.abonos = []
      coach.abonos.push({
        cantidad: data.cantidad_abono_coach,
        fecha: data.fecha_abono_coach,
        metodo: data.metodo_pago_abono_coach
      })

      coach.total_abonado =
        parseFloat(data.cantidad_abono_coach) +
        parseFloat(coach.total_abonado || 0)

      coach.abono = 'NO'

      if (parseFloat(coach.total_abonado) === parseFloat(coach.monto)) {
        const fechaPagoAcumulado = coach.fecha_final
        coach.pago_coaching = [
          ...(coach.pago_coaching || []),
          {
            fecha_inicial: coach.fecha_final
              ? fechaPagoAcumulado
              : data.fecha_abono_coach,
            fecha_final: coach.fecha_final
              ? coach.fecha_final
              : data.fecha_abono_coach,
            total_pagado: coach.total_abonado
          }
        ]
        coach.metodo_pago = data.metodo_pago_abono_coach
        coach.fecha_pago = coach.fecha_final
        coach.fecha_inicial = coach.fecha_final
        coach.fecha_limite = dayjs(coach.fecha_final)
          .add(1, 'week')
          .format('YYYY-MM-DD')
        coach.fecha_final = null
        coach.total_restante = 0
        coach.historial_total_abonado =
          parseFloat(coach.total_abonado || 0) +
          parseFloat(coach.historial_total_abonado || 0)
        coach.total_abonado = 0
        coach.descuento = 0
      }
      coach.historial_total_pagado =
        parseFloat(coach.historial_total_pagado || 0) +
        parseFloat(data.cantidad_abono_coach)

      // Abonos en caja
      const coachPagoCaja = {
        jugadorId: data.jugadorId,
        nombre: data.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de coach (abono)',
        fecha_pago: data.fecha_abono_coach || hoy,
        total: data.cantidad_abono_coach || 0,
        metodo_pago: data.metodo_pago_abono_coach || null
      }
      await createCaja(coachPagoCaja)
    }

    // Guardar pago en caja
    const dataEstatus = {
      ...data,
      pagos: data.pagos.map((pago) => ({ ...pago }))
    }

    const hoy = dayjs().format('YYYY-MM-DD')
    if (inscripcion.estatus === 'pagado') {
      inscripcion.total_restante = 0

      const inscripcionPagos = {
        jugadorId: dataEstatus.jugadorId,
        nombre: dataEstatus.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de inscripción',
        fecha_pago: inscripcion.fecha_pago || hoy,
        total: inscripcion.monto || 0,
        metodo_pago: inscripcion.metodo_pago || null
      }
      await createCaja(inscripcionPagos)
    }

    if (tunel.estatus === 'pagado') {
      tunel.total_restante = 0

      const tunelPagos = {
        jugadorId: dataEstatus.jugadorId,
        nombre: dataEstatus.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de aportación',
        fecha_pago: tunel.fecha_pago || hoy,
        total: tunel.monto || 0,
        metodo_pago: tunel.metodo_pago || null
      }
      await createCaja(tunelPagos)
    }

    if (botiquin.estatus === 'pagado') {
      botiquin.total_restante = 0

      const botiquinPagos = {
        jugadorId: dataEstatus.jugadorId,
        nombre: dataEstatus.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de botiquín',
        fecha_pago: botiquin.fecha_pago || hoy,
        total: botiquin.monto || 0,
        metodo_pago: botiquin.metodo_pago || null
      }
      await createCaja(botiquinPagos)
    }

    if (coach.estatus === 'pagado') {
      coach.total_restante = 0

      const coachingPagos = {
        jugadorId: dataEstatus.jugadorId,
        nombre: dataEstatus.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de coaching semanal',
        fecha_pago: coach.fecha_pago || hoy,
        total: coach.monto || 0,
        metodo_pago: coach.metodo_pago || null
      }
      await createCaja(coachingPagos)
    }

    delete newData.cambiar_inscripcion
    delete newData.cambiar_coach

    delete newData.historial_total_pagado
    delete newData.jugador
    delete newData.botiquin
    delete newData.coacheo
    delete newData.inscripcion
    delete newData.prorroga
    delete newData.tunel
    delete newData.fecha_limite

    delete newData.cantidad_abono_ins
    delete newData.fecha_abono_ins
    delete newData.metodo_pago_abono_ins

    delete newData.cantidad_abono_coach
    delete newData.fecha_abono_coach
    delete newData.metodo_pago_abono_coach

    delete newData.cantidad_abono_tunel
    delete newData.fecha_abono_tunel
    delete newData.metodo_pago_abono_tunel

    delete newData.cantidad_abono_botiquin
    delete newData.fecha_abono_botiquin
    delete newData.metodo_pago_abono_botiquin

    const dataRef = doc(db, 'pagos_jugadores', id)
    await updateDoc(dataRef, newData)
  } catch (error) {
    console.error('Error al actualizar pago:', error)
  }
}

// Eliminar un pago
export const removePayment = async (id) => {
  try {
    const data = await getPaymentById(id)
    await removePlayer(data.jugadorId)

    const dataRef = doc(db, 'pagos_jugadores', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar pago:', error)
  }
}

export const removePaymentByPlayer = async (id) => {
  try {
    const dataRef = doc(db, 'pagos_jugadores', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar pago:', error)
  }
}

export const removeAbonos = async (id) => {
  try {
    const data = await getPaymentById(id)

    // Limpiar los abonos del tipo "Coaching"
    const updatedPagos = data.pagos.map((pago) => {
      if (pago.tipo === 'Coaching') {
        return {
          ...pago,
          abonos: [],
          total_abonado: 0,
          total_restante: parseFloat(pago.monto || 0)
        }
      }
      return pago
    })

    // Armar nuevo objeto a guardar
    const updatedData = {
      ...data,
      pagos: updatedPagos
    }

    const dataRef = doc(db, 'pagos_jugadores', id)
    await updateDoc(dataRef, updatedData)
  } catch (error) {
    console.error('Error al limpiar abonos de Coaching:', error)
  }
}
