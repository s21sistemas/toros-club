import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const peticionEliminacionCollection = collection(db, 'peticiones_eliminación')

// Crear un banco
export const createPeticionEliminacion = async (data) => {
  try {
    const docRef = await addDoc(peticionEliminacionCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar banco:', error)
  }
}

// Obtener registro
export const getPeticionEliminacion = async (callback) => {
  return onSnapshot(peticionEliminacionCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

// Actualizar un banco
export const updatePeticionEliminacion = async (id, data) => {
  try {
    const dataRef = doc(db, 'peticiones_eliminación', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar banco:', error)
  }
}

// Eliminar un banco
export const removePeticionEliminacion = async (id) => {
  try {
    const dataRef = doc(db, 'peticiones_eliminación', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar banco:', error)
  }
}
