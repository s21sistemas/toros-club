import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  getDocs,
  where
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const costosCollection = collection(db, 'costos-jugador')

// Crear un costo
export const createCostoJugador = async (data) => {
  try {
    const docRef = await addDoc(costosCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar costo:', error)
  }
}

// Obtener registro
export const getCostoJugador = async (callback) => {
  return onSnapshot(costosCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      temporada: doc.data().temporadaId.label
    }))
    callback(data)
  })
}

// Obtener costos por temporada
export const obtenerCostoTemporada = async (temporadaId) => {
  try {
    const snapshot = await getDocs(
      query(costosCollection, where('temporadaId', '==', temporadaId))
    )
    return snapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error('Error al obtener jugadores:', error)
    return []
  }
}

// Actualizar un costo
export const updateCostoJugador = async (id, data) => {
  try {
    delete data.temporada

    const dataRef = doc(db, 'costos-jugador', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar costo:', error)
  }
}

// Eliminar un costo
export const removeCostoJugador = async (id) => {
  try {
    const dataRef = doc(db, 'costos-jugador', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar costo:', error)
  }
}
