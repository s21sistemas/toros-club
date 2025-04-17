import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const articulosCollection = collection(db, 'articulos')

// Crear artículo
export const createArticulo = async (data) => {
  try {
    const docRef = await addDoc(articulosCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar artículo:', error)
  }
}

export const getArticuloById = async (id) => {
  try {
    const dataRef = doc(db, 'articulos', id)
    const docSnap = await getDoc(dataRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      console.log('No se encontró el artículo con ID:', id)
      return null
    }
  } catch (error) {
    console.error('Error al obtener artículo por ID:', error)
  }
}

// Obtener registro
export const getArticulos = async (callback) => {
  return onSnapshot(articulosCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

export const getEquipo = async (callback) => {
  const q = query(articulosCollection, where('articulo_equipar', '==', 'SI'))

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(data)
  })
}

// Actualizar artículo
export const updateArticulo = async (id, data) => {
  try {
    const dataRef = doc(db, 'articulos', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar artículo:', error)
  }
}

// Eliminar artículo
export const removeArticulo = async (id) => {
  try {
    const dataRef = doc(db, 'articulos', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar artículo:', error)
  }
}
