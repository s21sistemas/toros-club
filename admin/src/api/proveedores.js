import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const proveedoresCollection = collection(db, 'proveedores')

// Crear un proveedor
export const createProveedor = async (data) => {
  try {
    const docRef = await addDoc(proveedoresCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar proveedor:', error)
  }
}

// Obtener registro
export const getProveedores = async (callback) => {
  return onSnapshot(proveedoresCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data()
      const nombre_comercial = docData.datos_fiscales?.nombre_comercial
      const rfc = docData.datos_fiscales?.rfc
      return { id: doc.id, ...doc.data(), nombre_comercial, rfc }
    })
    callback(data)
  })
}

// Actualizar un proveedor
export const updateProveedor = async (id, data) => {
  try {
    delete data.rfc
    delete data.nombre_comercial

    const dataRef = doc(db, 'proveedores', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar proveedor:', error)
  }
}

// Eliminar un proveedor
export const removeProveedor = async (id) => {
  try {
    const dataRef = doc(db, 'proveedores', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar proveedor:', error)
  }
}
