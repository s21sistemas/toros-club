import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  where,
  query
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import { createCaja } from './caja'
import { removeCheerleader } from './cheerleader'

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

export const getPaymentById = async (id) => {
  try {
    const docRef = doc(db, 'pagos_porristas', id)
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

export const getPaymentByPorristaId = async (id) => {
  try {
    const snapshot = await getDocs(
      query(pagosCollection, where('porristaId', '==', id))
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
        jugadorId: data.porristaId,
        nombre: data.nombre,
        tabla: 'Porrista',
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

      if (parseFloat(coach.total_abonado) === parseFloat(coach.monto)) {
        coach.estatus = 'pagado'
        coach.fecha_pago = data.fecha_abono_coach
        coach.metodo_pago = data.metodo_pago_abono_coach
        coach.total_restante = 0
      }

      // Abonos en caja
      const coachPagoCaja = {
        jugadorId: data.porristaId,
        nombre: data.nombre,
        tabla: 'Porrista',
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

    if (coach.estatus === 'pagado') {
      coach.total_restante = 0

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

    delete newData.porrista
    delete newData.coacheo
    delete newData.inscripcion

    delete newData.cantidad_abono_ins
    delete newData.fecha_abono_ins
    delete newData.metodo_pago_abono_ins

    delete newData.cantidad_abono_coach
    delete newData.fecha_abono_coach
    delete newData.metodo_pago_abono_coach

    const dataRef = doc(db, 'pagos_porristas', id)
    await updateDoc(dataRef, newData)
  } catch (error) {
    console.error('Error al actualizar pago:', error)
  }
}

// Eliminar un pago
export const removePayment = async (id) => {
  try {
    const data = await getPaymentById(id)
    await removeCheerleader(data.porristaId)

    const dataRef = doc(db, 'pagos_porristas', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar pago:', error)
  }
}

export const removePaymentByCheer = async (id) => {
  try {
    const dataRef = doc(db, 'pagos_porristas', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar pago:', error)
  }
}
