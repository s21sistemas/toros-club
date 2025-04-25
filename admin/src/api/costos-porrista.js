import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  where,
  query
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const costosCollection = collection(db, 'costos-porrista')

// Crear un costo
export const createCostoPorrista = async (data) => {
  try {
    const docRef = await addDoc(costosCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar costo:', error)
  }
}

// Obtener registro
export const getCostoPorrista = async (callback) => {
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
    console.error('Error al obtener porristas:', error)
    return []
  }
}

// Actualizar un costo
export const updateCostoPorrista = async (id, data) => {
  try {
    delete data.temporada

    const dataRef = doc(db, 'costos-porrista', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar costo:', error)
  }
}

// Eliminar un costo
export const removeCostoPorrista = async (id) => {
  try {
    const dataRef = doc(db, 'costos-porrista', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar costo:', error)
  }
}
