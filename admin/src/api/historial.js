import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const historialCollection = collection(db, 'historial')

// Crear un historial
export const createHistorial = async (data) => {
  try {
    const docRef = await addDoc(historialCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar historial:', error)
  }
}

// Obtener registro
export const getHistorial = async (callback) => {
  return onSnapshot(historialCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

// Actualizar registro
export const updateHistorial = async (id, data) => {
  try {
    const dataRef = doc(db, 'historial', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar historial:', error)
  }
}

// Eliminar un historial
export const removeHistorial = async (id) => {
  try {
    const dataRef = doc(db, 'historial', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar historial:', error)
  }
}
