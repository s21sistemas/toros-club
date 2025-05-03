import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  onSnapshot,
  getDoc
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import { obtenerCostoTemporada } from './costos-jugador'
import { toast } from 'sonner'
import { getPaymentByJugadorId, removePaymentByPlayer } from './paymentsPlayer'

const jugadoresCollection = collection(db, 'jugadores')
const pagosCollection = collection(db, 'pagos_jugadores')

// Crear un jugador
export const createPlayer = async (data) => {
  try {
    const newData = {
      ...data,
      fecha_registro: Timestamp.now()
    }
    const docRef = await addDoc(jugadoresCollection, newData)
    const jugadorId = docRef.id
    const nombreJugador = `${data.nombre} ${data.apellido_p} ${data.apellido_m}`
    const temporadaId = data.temporadaId
    const categoria = data.categoria
    await createPagoJugador(jugadorId, nombreJugador, temporadaId, categoria)
    return jugadorId
  } catch (error) {
    console.error('Error al agregar jugador:', error)
  }
}

// Obtener registro
export const getPlayers = async (callback) => {
  return onSnapshot(jugadoresCollection, async (snapshot) => {
    const data = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const user = await getUserByUID(doc.data().uid)
        const nombre = `${doc.data().nombre} ${doc.data().apellido_p} ${
          doc.data().apellido_m
        }`

        return {
          ...doc.data(),
          id: doc.id,
          nombre_completo: nombre,
          uid: { value: doc.data().uid, label: user?.nombre_completo }
        }
      })
    )

    callback(data)
  })
}

export const getPlayerById = async (id) => {
  try {
    const docRef = doc(db, 'jugadores', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const player = docSnap.data()
      const user = await getUserByUID(player.uid)

      const nombre = `${player.nombre} ${player.apellido_p} ${player.apellido_m}`

      return {
        ...player,
        id: docSnap.id,
        nombre_completo: nombre,
        uid: { value: player.uid, label: user?.nombre_completo }
      }
    } else {
      console.warn('No se encontró el jugador con ese ID')
      return null
    }
  } catch (error) {
    console.error('Error al obtener el jugador:', error)
    return null
  }
}

// Actualizar un jugador
export const updatePlayer = async (id, data) => {
  try {
    const dataRef = doc(db, 'jugadores', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar jugador:', error)
  }
}

// Eliminar un jugador
export const removePlayer = async (id) => {
  try {
    const data = await getPaymentByJugadorId(id)
    await removePaymentByPlayer(data[0].id)

    const dataRef = doc(db, 'jugadores', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar jugador:', error)
  }
}

export const getUserByUID = async (uid) => {
  try {
    const usersRef = collection(db, 'usuarios') // Referencia a la colección "usuarios"
    const q = query(usersRef, where('uid', '==', uid)) // Filtrar por id igual a uid
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Si se encontraron documentos, devolver el primero
      return querySnapshot.docs[0].data()
    } else {
      console.log('No se encontró un usuario con ese ID.')
      return null
    }
  } catch (error) {
    console.error('Error buscando usuario:', error)
    return null
  }
}

const createPagoJugador = async (
  jugadorId,
  nombreJugador,
  temporadaId,
  categoria
) => {
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
  const costoTunel = parseFloat(costosTemporada[0]?.tunel) || 500
  const costoBotiquin = parseFloat(costosTemporada[0]?.botiquin) || 500

  const montoTotal =
    costoInscripcion + costoCoaching + costoTunel + costoBotiquin

  const pagosIniciales = {
    jugadorId,
    nombre: nombreJugador,
    temporadaId,
    categoria,
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
        monto: costoCoaching,
        metodo_pago: null,
        abono: 'NO',
        abonos: [],
        total_abonado: 0
      },
      {
        tipo: 'Túnel',
        estatus: 'pendiente',
        fecha_pago: null,
        monto: costoTunel,
        metodo_pago: null,
        abono: 'NO',
        abonos: [],
        total_abonado: 0
      },
      {
        tipo: 'Botiquín',
        estatus: 'pendiente',
        fecha_pago: null,
        monto: costoBotiquin,
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
