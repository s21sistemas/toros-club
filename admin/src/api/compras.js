import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'

const comprasCollection = collection(db, 'compras')

// Registrar compra
export const createCompra = async (data) => {
  try {
    data.fecha = Timestamp.now()
    const docRef = await addDoc(comprasCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al registrar compra:', error)
  }
}

// Obtener registro
export const getCompras = async (callback) => {
  return onSnapshot(comprasCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      articulo: doc.data().articuloId.label,
      proveedor: doc.data().proveedorId.label,
      banco: doc.data()?.bancoId.label,
      fecha: dayjs.unix(doc.data().fecha.seconds).format('DD/MM/YYYY')
    }))
    callback(data)
  })
}

// Actualizar compra
export const updateCompra = async (id, data) => {
  try {
    delete data.articulo
    delete data.proveedor
    delete data.banco
    delete data.fecha

    const dataRef = doc(db, 'compras', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar compra:', error)
  }
}

// Eliminar compra
export const removeCompra = async (id) => {
  try {
    const dataRef = doc(db, 'compras', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar compra:', error)
  }
}
