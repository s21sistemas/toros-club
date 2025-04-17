import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import { getProfile } from './checkAuth'
import { createHistorial } from './historial'

const cajaCollection = collection(db, 'caja')
const auth = getAuth()
const user = auth.currentUser

// Agregar registro
export const createCaja = async (data) => {
  try {
    const usuario = await getProfile(user.uid)
    data.usuarioId = { label: usuario.nombre_completo, value: usuario.id }

    const q = query(
      cajaCollection,
      where('jugadorId', '==', data.jugadorId),
      where('concepto', '==', data.concepto),
      where('fecha_pago', '==', data.fecha_pago),
      where('total', '==', data.total)
    )

    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) return null

    const docRef = await addDoc(cajaCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar registro:', error)
  }
}

// Obtener registro
export const listenCaja = async (callback) => {
  return onSnapshot(cajaCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      fecha: dayjs(doc.data().fecha_pago).format('DD/MM/YYYY'),
      usuario: doc.data().usuarioId?.label || '',
      nombre_seccion: `${doc.data().nombre} (${doc.data().tabla})`
    }))

    callback(data)
  })
}

// Eliminar registro
export const removeCaja = async (data) => {
  try {
    if (data.entregado === 'SI') {
      const dataRef = doc(db, 'caja', data.id)
      await deleteDoc(dataRef)

      const newData = {
        coordinadora: data.usuario,
        nombre: `${data.nombre} (${data.tabla})`,
        concepto: data.concepto,
        metodo_pago: data.metodo_pago,
        fecha_pago: data.fecha,
        monto: data.total,
        fecha_recibido: dayjs().format('DD/MM/YYYY'),
        fecha_recibido_filter: Timestamp.now()
      }

      await createHistorial(newData)
    }
  } catch (error) {
    console.error('Error al eliminar registro:', error)
  }
}
