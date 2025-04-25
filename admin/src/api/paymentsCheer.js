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

const pagosCollection = collection(db, 'pagos_porristas')

// Crear un pago
export const createPayment = async (data) => {
  try {
    const actuallyDate = dayjs()

    const newData = {
      ...data,
      porristaId: data.porrista.value,
      nombre: data.porrista.label,
      fecha_registro: actuallyDate.format('YYYY-MM-DD')
    }

    delete newData.porrista

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
        porrista: { value: pago.porristaId, label: pago.nombre },
        inscripcion: pagos.find((p) => p.tipo === 'Inscripción')?.estatus,
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
    // DATAS
    const inscripcion = data.pagos.find((p) => p.tipo === 'Inscripción')
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
    if (inscripcion === 'pagado') {
      const inscripcionPago = {
        jugadorId: dataEstatus.porristaId,
        nombre: dataEstatus.nombre,
        tabla: 'Porrista',
        concepto: 'Pago de inscripción',
        fecha_pago: inscripcion.fecha_pago || hoy,
        total: inscripcion.monto || 0,
        metodo_pago: inscripcion.metodo_pago || null
      }
      await createCaja(inscripcionPago)
    }

    if (coach === 'pagado') {
      const coachPago = {
        jugadorId: dataEstatus.porristaId,
        nombre: dataEstatus.nombre,
        tabla: 'Porrista',
        concepto: 'Pago de coaching semanal',
        fecha_pago: coach.fecha_pago || hoy,
        total: coach.monto || 0,
        metodo_pago: coach.metodo_pago || null
      }
      await createCaja(coachPago)
    }

    delete data.porrista
    delete data.coacheo
    delete data.inscripcion

    delete data.cantidad_abono_ins
    delete data.fecha_abono_ins
    delete data.metodo_pago_abono_ins

    delete data.cantidad_abono_coach
    delete data.fecha_abono_coach
    delete data.metodo_pago_abono_coach

    const dataRef = doc(db, 'pagos_porristas', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar pago:', error)
  }
}

// Eliminar un pago
export const removePayment = async (id) => {
  try {
    const dataRef = doc(db, 'pagos_porristas', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar pago:', error)
  }
}
