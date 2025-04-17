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

const temporadasCollection = collection(db, 'temporadas')

// Crear un temporada
export const createTemporada = async (data) => {
  try {
    const docRef = await addDoc(temporadasCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar temporada:', error)
  }
}

// Obtener registro
export const getTemporada = async (callback) => {
  return onSnapshot(temporadasCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date_inicio: dayjs(doc.data().fecha_inicio).format('DD/MM/YYYY'),
      date_fin: dayjs(doc.data().fecha_fin).format('DD/MM/YYYY')
    }))
    callback(data)
  })
}

// Actualizar un temporada
export const updateTemporada = async (id, data) => {
  try {
    delete data.date_inicio
    delete data.date_fin
    const dataRef = doc(db, 'temporadas', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar temporada:', error)
  }
}

// Eliminar un temporada
export const removeTemporada = async (id) => {
  try {
    const dataRef = doc(db, 'temporadas', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar temporada:', error)
  }
}
