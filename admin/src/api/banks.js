import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const bancosCollection = collection(db, 'bancos')

// Crear un banco
export const createBank = async (data) => {
  try {
    const docRef = await addDoc(bancosCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar banco:', error)
  }
}

// Obtener registro
export const getBanks = async (callback) => {
  return onSnapshot(bancosCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

// Actualizar un banco
export const updateBank = async (id, data) => {
  try {
    const dataRef = doc(db, 'bancos', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar banco:', error)
  }
}

// Eliminar un banco
export const removeBank = async (id) => {
  try {
    const dataRef = doc(db, 'bancos', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar banco:', error)
  }
}
