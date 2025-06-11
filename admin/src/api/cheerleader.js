import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  getDoc,
  deleteField,
  getDocs
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import { obtenerCostoTemporada } from './costos-porrista'
import { toast } from 'sonner'
import { getPaymentByPorristaId, removePaymentByCheer } from './paymentsCheer'
import { getUserByUID } from './players'
import { removeCheerFromCoordinator, updateUserCoord } from './users'

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

    if (data?.coordinadoraId) {
      const porristaData = {
        label: nombrePorrista,
        value: porristaId
      }
      await updateUserCoord(data?.coordinadoraId.value, porristaData)
    }

    return porristaId
  } catch (error) {
    console.error('Error al agregar porrista:', error)
  }
}

// Obtener registro
export const getCheerleaders = async (callback) => {
  return onSnapshot(porristasCollection, async (snapshot) => {
    const data = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const user = await getUserByUID(doc.data().uid)

        return {
          id: doc.id,
          ...doc.data(),
          uid: { value: doc.data().uid, label: user?.nombre_completo }
        }
      })
    )

    callback(data)
  })
}

// Obtener registro
export const getCheerleadersCoord = async () => {
  try {
    const snapshot = await getDocs(porristasCollection)

    const data = await Promise.all(
      snapshot.docs
        .filter((doc) => !doc.data().coordinadoraId)
        .map(async (doc) => {
          const user = await getUserByUID(doc.data().uid)

          return {
            id: doc.id,
            ...doc.data(),
            uid: { value: doc.data().uid, label: user?.nombre_completo }
          }
        })
    )

    return data
  } catch (error) {
    console.error('Error al obtener porristas sin coordinadora:', error)
    return []
  }
}

// Actualizar un porrista
export const updateCheerleader = async (id, data) => {
  try {
    const dataRef = doc(db, 'porristas', id)
    const docSnap = await getDoc(dataRef)

    if (!docSnap.exists()) {
      console.error('Porrista no encontrada')
      return
    }

    const prevData = docSnap.data()
    const anteriorCoordId = prevData?.coordinadoraId?.value
    const nuevaCoordId = data?.coordinadoraId?.value

    const nombrePorrista = `${data.nombre} ${data.apellido_p} ${data.apellido_m}`
    const porristaData = {
      label: nombrePorrista,
      value: id
    }

    // Si cambió de coordinadora
    if (anteriorCoordId && nuevaCoordId && anteriorCoordId !== nuevaCoordId) {
      await removeCheerFromCoordinator(anteriorCoordId, id)
    }

    // Agregar o actualizar en la nueva coordinadora
    if (nuevaCoordId) {
      await updateUserCoord(nuevaCoordId, porristaData)
    }

    // Actualizar datos de la porrista (incluye coordinadoraId)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar porrista:', error)
  }
}

// Actualizarle sus coordinadoras
export const updateCheerleaderCoord = async (id, data) => {
  try {
    const dataRef = doc(db, 'porristas', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar porrista:', error)
  }
}

export const removeCheerleaderCoordFromPorrista = async (porristaId) => {
  try {
    const dataRef = doc(db, 'porristas', porristaId)
    const docSnap = await getDoc(dataRef)

    if (!docSnap.exists()) {
      console.error('Porrista no encontrada para limpiar coordinadoraId')
      return
    }

    await updateDoc(dataRef, { coordinadoraId: deleteField() })
  } catch (error) {
    console.error('Error al eliminar coordinadoraId de porrista:', error)
  }
}

// Eliminar un porrista
export const removeCheerleader = async (id) => {
  try {
    // 1. Obtener la porrista para saber su coordinadora
    const dataRef = doc(db, 'porristas', id)
    const docSnap = await getDoc(dataRef)

    if (!docSnap.exists()) {
      console.error('Porrista no encontrada')
      return
    }

    const data = docSnap.data()
    const coordId = data?.coordinadoraId?.value

    // 2. Si tiene coordinadora, removerla del array
    if (coordId) {
      await removeCheerFromCoordinator(coordId, id)
    }

    // 3. Eliminar pagos relacionados (si los tienes)
    const pagos = await getPaymentByPorristaId(id)
    if (pagos.length > 0) {
      await removePaymentByCheer(pagos[0].id)
    }

    // 4. Eliminar el documento de la porrista
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar porrista:', error)
  }
}

const createPagoCheer = async (porristaId, nombrePorrista, temporadaId) => {
  const actuallyDate = dayjs()
  const dateWeek = actuallyDate.add(1, 'week').format('YYYY/MM/DD')

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
    temporadaId,
    pagos: [
      {
        tipo: 'Inscripción',
        beca: '0',
        descuento: '0',
        estatus: 'pendiente',
        fecha_pago: null,
        submonto: costoInscripcion,
        monto: costoInscripcion,
        prorroga: false,
        fecha_limite: dateWeek,
        metodo_pago: null,
        abono: 'NO',
        abonos: [],
        total_abonado: 0
      },
      {
        tipo: 'Coaching',
        estatus: 'pendiente',
        fecha_pago: null,
        fecha_limite: null,
        fecha_inicial: actuallyDate.format('YYYY-MM-DD'),
        fecha_final: null,
        descuento: '0',
        submonto: costoCoaching,
        historial_total_abonado: 0,
        historial_total_pagado: 0,
        monto: costoCoaching,
        metodo_pago: null,
        abono: 'NO',
        abonos: [],
        pagos_coaching: [],
        total_abonado: 0
      }
    ],
    monto_total_pagado: 0,
    monto_total_pagado_coaching: 0,
    monto_total_pendiente: montoTotal,
    monto_total: montoTotal,
    fecha_registro: actuallyDate.format('YYYY-MM-DD')
  }

  await addDoc(pagosCollection, pagosIniciales)
}
