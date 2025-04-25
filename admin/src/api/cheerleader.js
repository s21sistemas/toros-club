import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import { obtenerCostoTemporada } from './costos-porrista'
import { toast } from 'sonner'

const porristasCollection = collection(db, 'porristas')
const pagosCollection = collection(db, 'pagos_porristas')

// Crear un porrista
export const createCheerleader = async (data) => {
  try {
    const newData = {
      ...data,
      fecha_registro: Timestamp.now()
    }

    const docRef = await addDoc(porristasCollection, newData)
    const porristaId = docRef.id
    const nombrePorrista = `${data.nombre} ${data.apellido_p} ${data.apellido_m}`
    const temporadaId = data.temporadaId
    await createPagoCheer(porristaId, nombrePorrista, temporadaId)

    return porristaId
  } catch (error) {
    console.error('Error al agregar porrista:', error)
  }
}

// Obtener registro
export const getCheerleaders = async (callback) => {
  return onSnapshot(porristasCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      foto: doc.data().foto_jugador,
      ...doc.data()
    }))
    callback(data)
  })
}

// Actualizar un porrista
export const updateCheerleader = async (id, data) => {
  try {
    const dataRef = doc(db, 'porristas', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar porrista:', error)
  }
}

// Eliminar un porrista
export const removeCheerleader = async (id) => {
  try {
    const dataRef = doc(db, 'porristas', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar porrista:', error)
  }
}

const createPagoCheer = async (porristaId, nombrePorrista, temporadaId) => {
  const actuallyDate = dayjs()

  const costosTemporada = await obtenerCostoTemporada(temporadaId)

  if (costosTemporada.length === 0) {
    toast.warning(
      'No se encontraron costos para esta temporada. Se usarán valores por defecto.'
    )
  }

  const costoInscripcion = parseFloat(costosTemporada[0]?.inscripcion) || 500
  const costoCoaching = parseFloat(costosTemporada[0]?.coaching) || 500
  const montoTotal = costoInscripcion + costoCoaching

  const pagosIniciales = {
    porristaId,
    nombre: nombrePorrista,
    pagos: [
      {
        tipo: 'Inscripción',
        estatus: 'pendiente',
        fecha_pago: null,
        monto: costoInscripcion,
        metodo_pago: null,
        abono: 'NO',
        abonos: [],
        total_abonado: 0
      },
      {
        tipo: 'Coaching',
        estatus: 'pendiente',
        fecha_pago: null,
        monto: costoCoaching,
        metodo_pago: null,
        abono: 'NO',
        abonos: [],
        total_abonado: 0
      }
    ],
    monto_total_pagado: 0,
    monto_total_pendiente: montoTotal,
    monto_total: montoTotal,
    fecha_registro: actuallyDate.format('YYYY-MM-DD')
  }

  await addDoc(pagosCollection, pagosIniciales)
}
