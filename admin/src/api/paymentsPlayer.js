import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import { createCaja } from './caja'

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

    callback(data)
  })
}

// Actualizar un pago
export const updatePayment = async (id, data) => {
  try {
    let newData = { ...data }

    // Actualizar coaching
    const index = data.pagos.findIndex((p) => p.tipo === 'Coaching')
    if (index !== -1) {
      const coachingPayment = data.pagos[index] // Obtener el objeto original
      const actuallyDate = dayjs() // Fecha actual

      // Si hay fecha de pago, sumarle una semana; si no, usar la fecha actual
      const newFechaLimite = coachingPayment.fecha_pago
        ? dayjs(coachingPayment.fecha_pago).add(1, 'week').format('YYYY-MM-DD')
        : actuallyDate.add(1, 'week').format('YYYY-MM-DD')

      // Si fecha de pago es null, se pone el día actual
      const fecha_pago = coachingPayment.fecha_pago
        ? coachingPayment.fecha_pago
        : actuallyDate.format('YYYY-MM-DD')

      // Si el pago está en "pagado", actualizar su estado y fecha límite
      if (coachingPayment.estatus === 'pagado') {
        newData.pagos[index] = {
          ...coachingPayment,
          estatus: 'pendiente',
          fecha_limite: newFechaLimite,
          fecha_pago
        }
      }
    }

    // DATAS
    const inscripcion = data.pagos.find((p) => p.tipo === 'Inscripción')
    const tunel = data.pagos.find((p) => p.tipo === 'Túnel')
    const botiquin = data.pagos.find((p) => p.tipo === 'Botiquín')
    const coach = data.pagos.find((p) => p.tipo === 'Coaching')

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

      // Abonos en caja
      const tunelPagoCaja = {
        jugadorId: data.jugadorId,
        nombre: data.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de tunel (abono)',
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
      const tunelPagos = {
        jugadorId: dataEstatus.jugadorId,
        nombre: dataEstatus.nombre,
        tabla: 'Jugador',
        concepto: 'Pago de túnel',
        fecha_pago: tunel.estatus.fecha_pago || hoy,
        total: tunel.estatus.monto || 0,
        metodo_pago: tunel.estatus.metodo_pago || null
      }
      await createCaja(tunelPagos)
    }

    if (botiquin.estatus === 'pagado') {
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
    const dataRef = doc(db, 'pagos_jugadores', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar pago:', error)
  }
}
