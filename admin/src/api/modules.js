import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const modulosCollection = collection(db, 'modulos')

// Crear un módulo
export const createModule = async (data) => {
  try {
    const newData = { label: data.nombre, value: data.nombre.toLowerCase() }
    const docRef = await addDoc(modulosCollection, newData)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar módulo:', error)
  }
}

// Obtener registro
export const getModules = async (callback) => {
  return onSnapshot(modulosCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      nombre: doc.data().label
    }))
    callback(data)
  })
}

// Actualizar un módulo
export const updateModule = async (id, data) => {
  try {
    const newData = { label: data.nombre, value: data.nombre.toLowerCase() }
    const dataRef = doc(db, 'modulos', id)

    delete data.nombre
    await updateDoc(dataRef, newData)
  } catch (error) {
    console.error('Error al actualizar módulo:', error)
  }
}

// Eliminar un módulo
export const removeModule = async (id) => {
  try {
    const dataRef = doc(db, 'modulos', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar módulo:', error)
  }
}
